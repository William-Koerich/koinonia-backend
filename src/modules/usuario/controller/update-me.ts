import { Request, Response } from 'express'
import { UpdateMeService } from '../service/update-me'

export class UpdateMeController {
  async handle(req: Request, res: Response) {
    try {
      const service = new UpdateMeService()
      const usuario = await service.execute(req.userId!, req.body)
      return res.json(usuario)
    } catch (err: any) {
      const status = err.message.includes('em uso') ? 409 : 400
      return res.status(status).json({ error: err.message })
    }
  }
}
