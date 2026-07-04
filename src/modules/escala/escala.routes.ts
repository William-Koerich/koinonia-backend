import { Router } from 'express'
import { prisma } from '../../config/prisma'
import { authMiddleware } from '../../middleware/auth'
import { requireRole, ADMINS } from '../../middleware/role'

const router = Router()

function getSundaysOfMonth(mes: number, ano: number): Date[] {
  const sundays: Date[] = []
  // Use noon UTC to avoid timezone day-shift (midnight UTC becomes previous day in UTC-3 Brazil)
  const date = new Date(Date.UTC(ano, mes - 1, 1, 12, 0, 0))
  while (date.getUTCDay() !== 0) date.setUTCDate(date.getUTCDate() + 1)
  while (date.getUTCMonth() === mes - 1) {
    sundays.push(new Date(date))
    date.setUTCDate(date.getUTCDate() + 7)
  }
  return sundays
}

const SLOTS_POR_POSICAO: Record<string, number> = {
  ESTACIONAMENTO: 2,
  PORTA_PRINCIPAL: 2,
  PORTA_LATERAL: 1,
  DATASHOW: 1,
  TRANSMISSAO: 1,
  CANTINA: 2,
  MIDIAS_CAMERA: 1,
  MIDIAS_STORIES: 1,
}

const POSICOES = Object.keys(SLOTS_POR_POSICAO)

// GET /escalas
router.get('/', authMiddleware, async (_req, res) => {
  const escalas = await prisma.escala.findMany({
    orderBy: [{ ano: 'desc' }, { mes: 'desc' }],
    include: {
      criador: { select: { id: true, nome: true, sobrenome: true } },
      _count: { select: { domingos: true } },
    },
  })
  res.json(escalas)
})

// GET /escalas/me
router.get('/me', authMiddleware, async (req, res) => {
  const vagas = await prisma.escalaVaga.findMany({
    where: { usuarioId: req.userId! },
    include: {
      domingo: {
        include: {
          escala: { select: { id: true, mes: true, ano: true } },
        },
      },
    },
    orderBy: { domingo: { data: 'asc' } },
  })
  res.json(vagas)
})

// GET /escalas/:id
router.get('/:id', authMiddleware, async (req, res) => {
  const id = req.params.id as string
  const escala = await prisma.escala.findUnique({
    where: { id },
    include: {
      criador: { select: { id: true, nome: true, sobrenome: true } },
      domingos: {
        orderBy: { data: 'asc' },
        include: {
          vagas: {
            orderBy: { posicao: 'asc' },
            include: {
              usuario: { select: { id: true, nome: true, sobrenome: true, foto: true } },
              ministerio: { select: { id: true, nome: true } },
            },
          },
        },
      },
    },
  })
  if (!escala) return res.status(404).json({ error: 'Escala não encontrada' })
  res.json(escala)
})

// POST /escalas
router.post('/', authMiddleware, requireRole(...ADMINS), async (req, res) => {
  const { mes, ano } = req.body as { mes: number; ano: number }
  if (!mes || !ano || mes < 1 || mes > 12) {
    return res.status(400).json({ error: 'Mês e ano inválidos' })
  }

  const existing = await prisma.escala.findUnique({ where: { mes_ano: { mes, ano } } })
  if (existing) return res.status(409).json({ error: 'Escala deste mês já existe' })

  const sundays = getSundaysOfMonth(mes, ano)

  const escala = await prisma.escala.create({
    data: {
      mes,
      ano,
      criadorId: req.userId!,
      domingos: {
        create: sundays.map(data => ({
          data,
          vagas: {
            create: POSICOES.flatMap(pos =>
              Array.from({ length: SLOTS_POR_POSICAO[pos] }, (_, i) => ({
                posicao: pos as any,
                slot: i + 1,
              }))
            ),
          },
        })),
      },
    },
    include: {
      domingos: {
        orderBy: { data: 'asc' },
        include: {
          vagas: {
            orderBy: { posicao: 'asc' },
            include: {
              usuario: { select: { id: true, nome: true, sobrenome: true, foto: true } },
              ministerio: { select: { id: true, nome: true } },
            },
          },
        },
      },
    },
  })
  res.status(201).json(escala)
})

// PUT /escalas/:id/domingos/:domingoId
router.put('/:id/domingos/:domingoId', authMiddleware, requireRole(...ADMINS), async (req, res) => {
  const escalaId = req.params.id as string
  const domingoId = req.params.domingoId as string

  const domingo = await prisma.escalaDomingo.findUnique({
    where: { id: domingoId },
    select: { escalaId: true },
  })
  if (!domingo || domingo.escalaId !== escalaId) {
    return res.status(404).json({ error: 'Domingo não encontrado nesta escala' })
  }

  const vagas = req.body as Array<{
    posicao: string
    slot: number
    usuarioId?: string | null
    ministerioId?: string | null
    grupoCaseiro?: string | null
  }>

  await prisma.$transaction([
    prisma.escalaVaga.deleteMany({ where: { domingoId } }),
    ...(vagas.length > 0
      ? [prisma.escalaVaga.createMany({
          data: vagas.map(v => ({
            domingoId,
            posicao: v.posicao as any,
            slot: v.slot,
            usuarioId: v.usuarioId ?? null,
            ministerioId: v.ministerioId ?? null,
            grupoCaseiro: v.grupoCaseiro ?? null,
          })),
        })]
      : []),
  ])

  const updated = await prisma.escalaDomingo.findUnique({
    where: { id: domingoId },
    include: {
      vagas: {
        orderBy: { posicao: 'asc' },
        include: {
          usuario: { select: { id: true, nome: true, sobrenome: true, foto: true } },
          ministerio: { select: { id: true, nome: true } },
        },
      },
    },
  })
  res.json(updated)
})

// DELETE /escalas/:id
router.delete('/:id', authMiddleware, requireRole(...ADMINS), async (req, res) => {
  const id = req.params.id as string
  const escala = await prisma.escala.findUnique({ where: { id } })
  if (!escala) return res.status(404).json({ error: 'Escala não encontrada' })
  await prisma.escala.delete({ where: { id } })
  res.json({ ok: true })
})

export default router
