import { Request, Response } from 'express'
import { GetMeService } from '../service/get-me'

export class GetMeController {
  async handle(req: Request, res: Response) {
    try {
      const service = new GetMeService()
      const usuario = await service.execute(req.userId!)
      return res.json(usuario)
    } catch (err: any) {
      return res.status(404).json({ error: err.message })
    }
  }
}
