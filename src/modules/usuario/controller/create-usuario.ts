import { Request, Response } from "express";
import { CreateUsuarioService } from "../service/create-usuario";

export class CreateUsuarioController {
  async handle(req: Request, res: Response) {
    try {
      const service = new CreateUsuarioService();
      const usuario = await service.execute(req.body);
      return res.status(201).json(usuario);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
