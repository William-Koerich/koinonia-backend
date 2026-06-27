import { Request, Response } from 'express'
import { RegisterService } from '../service/register'

export class RegisterController {
  async handle(req: Request, res: Response) {
    try {
      const service = new RegisterService()
      const result = await service.execute(req.body)
      return res.status(201).json(result)
    } catch (err: any) {
      const status = err.message === 'E-mail já cadastrado' ? 409 : 400
      return res.status(status).json({ error: err.message })
    }
  }
}
