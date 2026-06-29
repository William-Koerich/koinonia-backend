import { Router } from "express";
import { CreateUsuarioController } from "../controller/create-usuario";
import { ListUsuarioController } from "../controller/list-usuario";
import { GetUsuarioController } from "../controller/get-usuario";
import { UpdateUsuarioController } from "../controller/update-usuario";
import { DeleteUsuarioController } from "../controller/delete-usuario";
import { GetMeController } from "../controller/get-me";
import { UpdateMeController } from "../controller/update-me";
import { ChangePasswordController } from "../controller/change-password";
import { UpdateFotoController } from "../controller/update-foto";
import { ToggleAtivoController } from "../controller/toggle-ativo";
import { authMiddleware } from "../../../middleware/auth";
import { uploadFoto } from "../../../middleware/upload";

const router = Router();

const createController = new CreateUsuarioController();
const listController = new ListUsuarioController();
const getController = new GetUsuarioController();
const updateController = new UpdateUsuarioController();
const deleteController = new DeleteUsuarioController();
const getMeController = new GetMeController();
const updateMeController = new UpdateMeController();
const changePasswordController = new ChangePasswordController();
const updateFotoController = new UpdateFotoController();
const toggleAtivoController = new ToggleAtivoController();

// Rotas autenticadas — /me precisa vir ANTES de /:id
router.get("/me", authMiddleware, getMeController.handle);
router.put("/me", authMiddleware, updateMeController.handle);
router.put("/me/senha", authMiddleware, changePasswordController.handle);
router.post("/me/foto", authMiddleware, uploadFoto.single("foto"), updateFotoController.handle);

router.post("/", createController.handle);
router.get("/", authMiddleware, listController.handle);
router.get("/:id", authMiddleware, getController.handle);
router.put("/:id", authMiddleware, updateController.handle);
router.patch("/:id/toggle-ativo", authMiddleware, toggleAtivoController.handle);
router.delete("/:id", authMiddleware, deleteController.handle);

export default router;
