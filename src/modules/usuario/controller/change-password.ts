import { Request, Response } from 'express'
import { ChangePasswordService } from '../service/change-password'

export class ChangePasswordController {
  async handle(req: Request, res: Response) {
    try {
      const { senhaAtual, novaSenha } = req.body
      const service = new ChangePasswordService()
      const result = await service.execute(req.userId!, senhaAtual, novaSenha)
      return res.json(result)
    } catch (err: any) {
      const status = err.message === 'Senha atual incorreta' ? 401 : 400
      return res.status(status).json({ error: err.message })
    }
  }
}
