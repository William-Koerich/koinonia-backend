import express from "express";
import cors from "cors";
import usuarioRoutes from "./modules/usuario/routes/usuario";
import authRoutes from "./modules/auth/routes/auth";

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
