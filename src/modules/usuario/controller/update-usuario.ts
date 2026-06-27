import { Request, Response } from "express";
import { UpdateUsuarioService } from "../service/update-usuario";

export class UpdateUsuarioController {
  async handle(req: Request, res: Response) {
    try {
      const service = new UpdateUsuarioService();
      const usuario = await service.execute(req.params.id as string, req.body);
      return res.json(usuario);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
