import { prisma } from '../../config/prisma'

export interface CreateMinisterioDTO {
  nome: string
  descricao?: string
  liderId?: string
  coLideresIds?: string[]
}

export interface UpdateMinisterioDTO {
  nome?: string
  descricao?: string
  liderId?: string
  coLideresIds?: string[]
}

const INCLUDE = {
  lider: { select: { id: true, nome: true, sobrenome: true, foto: true } },
  coLideres: {
    include: { usuario: { select: { id: true, nome: true, sobrenome: true, foto: true } } },
  },
} as const

export class MinisterioRepository {
  async create({ coLideresIds, ...data }: CreateMinisterioDTO) {
    return prisma.ministerio.create({
      data: {
        ...data,
        coLideres: coLideresIds?.length
          ? { create: coLideresIds.map(uid => ({ usuarioId: uid })) }
          : undefined,
      },
      include: INCLUDE,
    })
  }

  findAll() {
    return prisma.ministerio.findMany({ include: INCLUDE, orderBy: { nome: 'asc' } })
  }

  findById(id: string) {
    return prisma.ministerio.findUnique({ where: { id }, include: INCLUDE })
  }

  async update(id: string, { coLideresIds, ...data }: UpdateMinisterioDTO) {
    return prisma.$transaction(async tx => {
      await tx.ministerio.update({ where: { id }, data })

      if (coLideresIds !== undefined) {
        await tx.ministerioCoLider.deleteMany({ where: { ministerioId: id } })
        if (coLideresIds.length > 0) {
          await tx.ministerioCoLider.createMany({
            data: coLideresIds.map(uid => ({ ministerioId: id, usuarioId: uid })),
          })
        }
      }

      return tx.ministerio.findUnique({ where: { id }, include: INCLUDE })
    })
  }

  delete(id: string) {
    return prisma.ministerio.delete({ where: { id } })
  }
}
