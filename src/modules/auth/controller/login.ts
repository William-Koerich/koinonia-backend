import { Request, Response } from 'express'
import { LoginService } from '../service/login'

export class LoginController {
  async handle(req: Request, res: Response) {
    try {
      const service = new LoginService()
      const result = await service.execute(req.body)
      return res.status(200).json(result)
    } catch (err: any) {
      return res.status(401).json({ error: err.message })
    }
  }
}
