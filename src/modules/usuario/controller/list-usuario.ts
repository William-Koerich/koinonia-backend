import { Request, Response } from "express";
import { ListUsuarioService } from "../service/list-usuario";

export class ListUsuarioController {
  async handle(_req: Request, res: Response) {
    try {
      const service = new ListUsuarioService();
      const usuarios = await service.execute();
      return res.json(usuarios);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
