import { Router } from 'express'
import { RegisterController } from '../controller/register'
import { LoginController } from '../controller/login'

const router = Router()

const registerController = new RegisterController()
const loginController = new LoginController()

router.post('/register', registerController.handle)
router.post('/login', loginController.handle)

export default router
