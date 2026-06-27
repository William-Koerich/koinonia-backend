import { Request, Response } from "express";
import { DeleteUsuarioService } from "../service/delete-usuario";

export class DeleteUsuarioController {
  async handle(req: Request, res: Response) {
    try {
      const service = new DeleteUsuarioService();
      await service.execute(req.params.id as string);
      return res.status(204).send();
    } catch (err: any) {
      return res.status(404).json({ error: err.message });
    }
  }
}
