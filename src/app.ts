import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import usuarioRoutes from "./modules/usuario/routes/usuario";
import authRoutes from "./modules/auth/routes/auth";
import ministerioRoutes from "./modules/ministerio/ministerio.routes";
import eventoRoutes from "./modules/evento/evento.routes";
import inscricaoRoutes from "./modules/inscricao/inscricao.routes";
import escalaRoutes from "./modules/escala/escala.routes";

export const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
app.use("/ministerios", ministerioRoutes);
app.use("/eventos", eventoRoutes);
app.use("/inscricoes", inscricaoRoutes);
app.use("/escalas", escalaRoutes);

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ error: "Arquivo muito grande (máximo 15MB)" });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err instanceof Error) {
    return res.status(400).json({ error: err.message });
  }
  res.status(500).json({ error: "Erro interno do servidor" });
});
