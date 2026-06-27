import { Request, Response } from "express";
import { GetUsuarioService } from "../service/get-usuario";

export class GetUsuarioController {
  async handle(req: Request, res: Response) {
    try {
      const service = new GetUsuarioService();
      const usuario = await service.execute(req.params.id as string);
      return res.json(usuario);
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}
