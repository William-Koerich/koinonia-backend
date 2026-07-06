import { Request, Response } from "express";
import { ListUsuarioService } from "../service/list-usuario";

export class ListUsuarioController {
  async handle(req: Request, res: Response) {
    try {
      const service = new ListUsuarioService();
      const { q, page, limit } = req.query;
      const opts =
        page !== undefined
          ? {
              q: String(q ?? ""),
              page: Math.max(1, Number(page)),
              limit: Math.min(100, Math.max(1, Number(limit ?? 10))),
            }
          : undefined;
      const result = await service.execute(opts);
      return res.json(result);
    } catch (err: any) {
      return res.status(400).json({ error: err.message });
    }
  }
}
