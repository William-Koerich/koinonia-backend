import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { prisma } from '../../../config/prisma'
import { LoginDTO } from '../dto/auth'

const JWT_SECRET = process.env.JWT_SECRET ?? 'koinonia_secret_dev'
const JWT_EXPIRES = '7d'

export class LoginService {
  async execute({ email, senha }: LoginDTO) {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) throw new Error('Credenciais inválidas')

    const senhaValida = await bcrypt.compare(senha, usuario.senhaHash)
    if (!senhaValida) throw new Error('Credenciais inválidas')

    const token = jwt.sign(
      { sub: usuario.id, email: usuario.email },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES },
    )

    return {
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        sobrenome: usuario.sobrenome,
        email: usuario.email,
        foto: usuario.foto,
        tipo: usuario.tipo,
        ativo: usuario.ativo,
      },
    }
  }
}
