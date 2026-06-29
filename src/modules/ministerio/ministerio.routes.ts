import { Router, Request, Response } from 'express'
import { authMiddleware } from '../../middleware/auth'
import { requireRole, GESTORES } from '../../middleware/role'
import { MinisterioRepository } from './ministerio.repository'

const router = Router()
const repo = new MinisterioRepository()

router.get('/', authMiddleware, async (_req: Request, res: Response) => {
  try {
    res.json(await repo.findAll())
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.get('/:id', authMiddleware, async (req: Request, res: Response) => {
  try {
    const m = await repo.findById(req.params.id as string)
    if (!m) return res.status(404).json({ error: 'Ministério não encontrado' })
    res.json(m)
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.post('/', authMiddleware, requireRole(...GESTORES), async (req: Request, res: Response) => {
  try {
    const { nome, descricao, liderId, coLideresIds } = req.body
    if (!nome) return res.status(400).json({ error: 'Nome é obrigatório' })
    res.status(201).json(await repo.create({ nome, descricao, liderId, coLideresIds }))
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.put('/:id', authMiddleware, requireRole(...GESTORES), async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string
    const m = await repo.findById(id)
    if (!m) return res.status(404).json({ error: 'Ministério não encontrado' })
    const { nome, descricao, liderId, coLideresIds } = req.body
    res.json(await repo.update(id, { nome, descricao, liderId, coLideresIds }))
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

router.delete('/:id', authMiddleware, requireRole(...GESTORES), async (req: Request, res: Response) => {
  try {
    const m = await repo.findById(req.params.id as string)
    if (!m) return res.status(404).json({ error: 'Ministério não encontrado' })
    await repo.delete(req.params.id as string)
    res.json({ ok: true })
  } catch (err: any) {
    res.status(400).json({ error: err.message })
  }
})

export default router
