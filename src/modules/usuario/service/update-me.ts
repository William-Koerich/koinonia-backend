import { Genero, EstadoCivil } from '@prisma/client'
import { prisma } from '../../../config/prisma'

export interface UpdateMeDTO {
  foto?: string
  nome?: string
  sobrenome?: string
  email?: string
  dataAniversario?: string
  genero?: Genero
  estadoCivil?: EstadoCivil
  logradouro?: string
  bairro?: string
  cidade?: string
}

export class UpdateMeService {
  async execute(userId: string, data: UpdateMeDTO) {
    if (data.email) {
      const existing = await prisma.usuario.findFirst({
        where: { email: data.email, NOT: { id: userId } },
      })
      if (existing) throw new Error('E-mail já está em uso por outro cadastro')
    }

    return prisma.usuario.update({
      where: { id: userId },
      data: {
        ...data,
        dataAniversario: data.dataAniversario ? new Date(data.dataAniversario) : undefined,
      },
      select: {
        id: true, email: true, foto: true, nome: true, sobrenome: true,
        dataAniversario: true, genero: true, estadoCivil: true,
        logradouro: true, bairro: true, cidade: true,
      },
    })
  }
}
