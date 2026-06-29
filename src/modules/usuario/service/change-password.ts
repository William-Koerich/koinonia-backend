import bcrypt from 'bcryptjs'
import { prisma } from '../../../config/prisma'

export class ChangePasswordService {
  async execute(userId: string, senhaAtual: string, novaSenha: string) {
    const usuario = await prisma.usuario.findUnique({ where: { id: userId } })
    if (!usuario) throw new Error('Usuário não encontrado')

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senhaHash)
    if (!senhaValida) throw new Error('Senha atual incorreta')

    if (novaSenha.length < 6) throw new Error('A nova senha precisa ter no mínimo 6 caracteres')

    const senhaHash = await bcrypt.hash(novaSenha, 10)
    await prisma.usuario.update({ where: { id: userId }, data: { senhaHash } })
    return { message: 'Senha alterada com sucesso' }
  }
}
