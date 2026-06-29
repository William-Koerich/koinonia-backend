import { Request, Response } from "express";
import { ToggleAtivoService } from "../service/toggle-ativo";

export class ToggleAtivoController {
  async handle(req: Request, res: Response) {
    try {
      const service = new ToggleAtivoService();
      const usuario = await service.execute(req.params.id as string);
      return res.json(usuario);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
