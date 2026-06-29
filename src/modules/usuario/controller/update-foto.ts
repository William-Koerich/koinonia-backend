import { Request, Response } from 'express'
import { UpdateFotoService } from '../service/update-foto'

export class UpdateFotoController {
  async handle(req: Request, res: Response) {
    try {
      if (!req.file) throw new Error('Nenhum arquivo enviado')
      const service = new UpdateFotoService()
      const result = await service.execute(req.userId!, req.file.path)
      return res.json(result)
    } catch (err: any) {
      return res.status(400).json({ error: err.message })
    }
  }
}
