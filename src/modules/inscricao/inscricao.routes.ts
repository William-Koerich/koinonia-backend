import { Router, Request, Response } from 'express'
import path from 'path'
import fs from 'fs'
import { authMiddleware } from '../../middleware/auth'
import { uploadComprovante } from '../../middleware/upload'
import { prisma } from '../../config/prisma'

const router = Router()

// Inscrever-se em um evento
router.post('/', authMiddleware, async (req: Request, res: Response) => {
  try {
    const { eventoId } = req.body
    if (!eventoId) return res.status(400).json({ error: 'eventoId é obrigatório' })

    const evento = await prisma.evento.findUnique({ where: { id: eventoId } })
    if (!evento) return res.status(404).json({ error: 'Evento não encontrado' })

    const existente = await prisma.inscricao.findUnique({
      where: { usuarioId_eventoId: { usuarioId: req.userId!, eventoId } },
    })
    if (existente) return res.status(409).json({ error: 'Você já está inscrito neste evento' })

    // Evento gratuito → APROVADA direto; com valor → PENDENTE
    const status = evento.valor === 0 ? 'APROVADA' : 'PENDENTE'

    const inscricao = await prisma.inscricao.create({
      data: { usuarioId: req.userId!, eventoId, status },
      include: {
        evento: {
          include: {
            ministerio: { select: { id: true, nome: true } },
            criador: { select: { id: true, nome: true, sobrenome: true } },
          },
        },
      },
    })

    res.status(201).json(inscricao)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// Minhas inscrições (eventos que estou inscrito)
router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  try {
    const inscricoes = await prisma.inscricao.findMany({
      where: { usuarioId: req.userId! },
      include: {
        evento: {
          include: {
            ministerio: { select: { id: true, nome: true } },
            criador: { select: { id: true, nome: true, sobrenome: true } },
            _count: { select: { inscritos: true } },
          },
        },
      },
      orderBy: { evento: { dataHora: 'asc' } },
    })
    res.json(inscricoes)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// Upload de comprovante de pagamento
router.post(
  '/:id/comprovante',
  authMiddleware,
  uploadComprovante.single('comprovante'),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'Nenhum arquivo enviado' })

      const inscricao = await prisma.inscricao.findUnique({
        where: { id: req.params.id as string },
      })
      if (!inscricao) return res.status(404).json({ error: 'Inscrição não encontrada' })
      if (inscricao.usuarioId !== req.userId) {
        return res.status(403).json({ error: 'Sem permissão' })
      }

      // Remove comprovante antigo se existir
      if (inscricao.comprovante) {
        const old = path.resolve(process.cwd(), inscricao.comprovante.replace(/^\//, ''))
        if (fs.existsSync(old)) fs.unlinkSync(old)
      }

      const comprovante = `/uploads/comprovantes/${path.basename(req.file.path)}`

      const updated = await prisma.inscricao.update({
        where: { id: req.params.id as string },
        data: { comprovante, pagoEm: new Date() },
        include: {
          evento: { select: { id: true, nome: true, valor: true } },
        },
      })

      res.json(updated)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  },
)

async function checkApprovalPermission(inscricaoId: string, userId: string): Promise<boolean> {
  const inscricao = await prisma.inscricao.findUnique({
    where: { id: inscricaoId },
    include: { evento: { select: { criadorId: true, ministerioId: true, ministerio: { select: { liderId: true } } } } },
  })
  if (!inscricao) return false

  const requester = await prisma.usuario.findUnique({ where: { id: userId }, select: { tipo: true } })

  if (requester?.tipo === 'ADMIN' || inscricao.evento.criadorId === userId || inscricao.evento.ministerio?.liderId === userId) {
    return true
  }

  if (inscricao.evento.ministerioId) {
    const isCoLider = await prisma.ministerioCoLider.findFirst({
      where: { ministerioId: inscricao.evento.ministerioId, usuarioId: userId },
    })
    if (isCoLider) return true
  }

  return false
}

// Aprovar inscrição
router.patch('/:id/aprovar', authMiddleware, async (req: Request, res: Response) => {
  try {
    const inscricao = await prisma.inscricao.findUnique({ where: { id: req.params.id as string } })
    if (!inscricao) return res.status(404).json({ error: 'Inscrição não encontrada' })

    if (!(await checkApprovalPermission(req.params.id as string, req.userId!))) {
      return res.status(403).json({ error: 'Sem permissão para aprovar inscrições' })
    }

    const updated = await prisma.inscricao.update({
      where: { id: req.params.id as string },
      data: { status: 'APROVADA' },
      include: {
        usuario: { select: { id: true, nome: true, sobrenome: true, email: true, foto: true } },
      },
    })

    res.json(updated)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// Rejeitar inscrição
router.patch('/:id/rejeitar', authMiddleware, async (req: Request, res: Response) => {
  try {
    const inscricao = await prisma.inscricao.findUnique({ where: { id: req.params.id as string } })
    if (!inscricao) return res.status(404).json({ error: 'Inscrição não encontrada' })

    if (!(await checkApprovalPermission(req.params.id as string, req.userId!))) {
      return res.status(403).json({ error: 'Sem permissão para rejeitar inscrições' })
    }

    const updated = await prisma.inscricao.update({
      where: { id: req.params.id as string },
      data: { status: 'REJEITADA' },
      include: {
        usuario: { select: { id: true, nome: true, sobrenome: true, email: true, foto: true } },
      },
    })

    res.json(updated)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

// Cancelar minha inscrição
router.delete('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const inscricao = await prisma.inscricao.findUnique({
      where: { id: req.params.id as string },
    })
    if (!inscricao) return res.status(404).json({ error: 'Inscrição não encontrada' })
    if (inscricao.usuarioId !== req.userId) {
      return res.status(403).json({ error: 'Sem permissão' })
    }
    await prisma.inscricao.delete({ where: { id: req.params.id as string } })
    res.json({ ok: true })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
