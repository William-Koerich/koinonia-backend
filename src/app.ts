import express from "express";
import cors from "cors";
import path from "path";
import usuarioRoutes from "./modules/usuario/routes/usuario";
import authRoutes from "./modules/auth/routes/auth";

export const app = express();

app.use(cors({
  origin: true,
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/auth", authRoutes);
app.use("/usuarios", usuarioRoutes);
