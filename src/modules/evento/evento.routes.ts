import { Router, Request, Response } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { requireRole, GESTORES, ADMINS } from '../../middleware/role'
import { uploadFotoEvento } from '../../middleware/upload'
import { EventoRepository } from './evento.repository'
import { prisma } from '../../config/prisma'
import { uploadToCloudinary, deleteFromCloudinary } from '../../config/cloudinary'

const router = Router()
const repo = new EventoRepository()

router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    res.json(await repo.findAll())
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const ev = await repo.findById(req.params.id as string)
    if (!ev) return res.status(404).json({ error: 'Evento não encontrado' })
    res.json(ev)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.post(
  '/',
  authMiddleware,
  requireRole(...GESTORES),
  uploadFotoEvento.single('foto'),
  async (req: Request, res: Response) => {
    try {
      const { nome, descricao, dataHora, localizacao, valor, ministerioId } = req.body
      if (!nome || !descricao || !dataHora) {
        return res.status(400).json({ error: 'nome, descricao e dataHora são obrigatórios' })
      }

      const foto = req.file
        ? await uploadToCloudinary(req.file.buffer, 'koinonia/eventos')
        : undefined

      const evento = await repo.create({
        foto,
        nome,
        descricao,
        dataHora: new Date(dataHora),
        localizacao: localizacao || undefined,
        valor: valor ? parseFloat(valor) : 0,
        ministerioId: ministerioId || undefined,
        criadorId: req.userId!,
      })

      await prisma.inscricao.create({
        data: { usuarioId: req.userId!, eventoId: evento.id, status: 'APROVADA', pagoEm: new Date() },
      }).catch(() => {})

      res.status(201).json(evento)
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  },
)

router.put(
  '/:id',
  authMiddleware,
  requireRole(...GESTORES),
  uploadFotoEvento.single('foto'),
  async (req: Request, res: Response) => {
    try {
      const id = req.params.id as string
      const ev = await repo.findById(id)
      if (!ev) return res.status(404).json({ error: 'Evento não encontrado' })

      const requester = await prisma.usuario.findUnique({ where: { id: req.userId! }, select: { tipo: true } })
      if (!ADMINS.includes(requester!.tipo)) {
        const isCreator = ev.criadorId === req.userId
        const isLider = ev.ministerio?.liderId === req.userId
        const isCoLider = ev.ministerioId
          ? !!(await prisma.ministerioCoLider.findFirst({ where: { ministerioId: ev.ministerioId, usuarioId: req.userId! } }))
          : false
        if (!isCreator && !isLider && !isCoLider) {
          return res.status(403).json({ error: 'Sem permissão para editar este evento' })
        }
      }

      const { nome, descricao, dataHora, localizacao, valor, ministerioId } = req.body

      let foto: string | undefined = ev.foto ?? undefined
      if (req.file) {
        if (ev.foto && ev.foto.startsWith('https://res.cloudinary.com')) {
          deleteFromCloudinary(ev.foto)
        }
        foto = await uploadToCloudinary(req.file.buffer, 'koinonia/eventos')
      }

      res.json(await repo.update(id, {
        foto,
        nome: nome || undefined,
        descricao: descricao || undefined,
        dataHora: dataHora ? new Date(dataHora) : undefined,
        localizacao: localizacao ?? undefined,
        valor: valor !== undefined ? parseFloat(valor) : undefined,
        ministerioId: ministerioId || undefined,
      }))
    } catch (err: any) {
      res.status(400).json({ error: err.message })
    }
  },
)

router.delete('/:id', authMiddleware, requireRole(...ADMINS), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const ev = await repo.findById(id)
    if (!ev) return res.status(404).json({ error: 'Evento não encontrado' })

    if (ev.foto && ev.foto.startsWith('https://res.cloudinary.com')) {
      deleteFromCloudinary(ev.foto)
    }

    await repo.delete(id)
    res.json({ ok: true })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/:id/inscritos', authMiddleware, async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const ev = await repo.findById(id)
    if (!ev) return res.status(404).json({ error: 'Evento não encontrado' })

    const requester = await prisma.usuario.findUnique({ where: { id: req.userId! }, select: { tipo: true } })
    const isCoLider = ev.ministerioId
      ? await prisma.ministerioCoLider.findFirst({ where: { ministerioId: ev.ministerioId, usuarioId: req.userId! } })
      : null

    const canView =
      requester?.tipo === 'ADMIN' ||
      ev.criadorId === req.userId ||
      ev.ministerio?.liderId === req.userId ||
      !!isCoLider

    if (!canView) return res.status(403).json({ error: 'Sem permissão para visualizar inscritos' })

    res.json(await repo.findInscritos(id))
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
