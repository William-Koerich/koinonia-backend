import { Router } from "express";
import { CreateUsuarioController } from "../controller/create-usuario";
import { ListUsuarioController } from "../controller/list-usuario";
import { GetUsuarioController } from "../controller/get-usuario";
import { UpdateUsuarioController } from "../controller/update-usuario";
import { DeleteUsuarioController } from "../controller/delete-usuario";

const router = Router();

const createController = new CreateUsuarioController();
const listController = new ListUsuarioController();
const getController = new GetUsuarioController();
const updateController = new UpdateUsuarioController();
const deleteController = new DeleteUsuarioController();

router.post("/", createController.handle);
router.get("/", listController.handle);
router.get("/:id", getController.handle);
router.put("/:id", updateController.handle);
router.delete("/:id", deleteController.handle);

export default router;
