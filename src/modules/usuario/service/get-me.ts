import { prisma } from '../../../config/prisma'

export class GetMeService {
  async execute(userId: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        foto: true,
        nome: true,
        sobrenome: true,
        dataAniversario: true,
        genero: true,
        estadoCivil: true,
        logradouro: true,
        bairro: true,
        cidade: true,
        createdAt: true,
      },
    })
    if (!usuario) throw new Error('Usuário não encontrado')
    return usuario
  }
}
