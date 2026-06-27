import bcrypt from 'bcryptjs'
import { prisma } from '../../../config/prisma'
import { RegisterDTO } from '../dto/auth'

export class RegisterService {
  async execute({ nome, sobrenome, email, senha }: RegisterDTO) {
    const existing = await prisma.usuario.findUnique({ where: { email } })
    if (existing) throw new Error('E-mail já cadastrado')

    const senhaHash = await bcrypt.hash(senha, 10)
    const usuario = await prisma.usuario.create({
      data: { nome, sobrenome, email, senhaHash },
      select: { id: true, nome: true, sobrenome: true, email: true, createdAt: true },
    })
    return usuario
  }
}
