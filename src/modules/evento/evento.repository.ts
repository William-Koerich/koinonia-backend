import { prisma } from '../../config/prisma'

export interface CreateEventoDTO {
  foto?: string
  nome: string
  descricao: string
  dataHora: Date
  localizacao?: string
  valor?: number
  ministerioId?: string
  criadorId: string
}

export type UpdateEventoDTO = Partial<Omit<CreateEventoDTO, 'criadorId'>>

const INCLUDE = {
  criador: { select: { id: true, nome: true, sobrenome: true, foto: true } },
  ministerio: {
    select: {
      id: true, nome: true,
      liderId: true, coLiderId: true,
      lider: { select: { id: true, nome: true, sobrenome: true } },
      coLider: { select: { id: true, nome: true, sobrenome: true } },
    },
  },
  _count: { select: { inscritos: true } },
} as const

export class EventoRepository {
  create(data: CreateEventoDTO) {
    return prisma.evento.create({ data, include: INCLUDE })
  }

  findAll() {
    return prisma.evento.findMany({ include: INCLUDE, orderBy: { dataHora: 'asc' } })
  }

  findById(id: string) {
    return prisma.evento.findUnique({ where: { id }, include: INCLUDE })
  }

  update(id: string, data: UpdateEventoDTO) {
    return prisma.evento.update({ where: { id }, data, include: INCLUDE })
  }

  delete(id: string) {
    return prisma.evento.delete({ where: { id } })
  }

  findInscritos(eventoId: string) {
    return prisma.inscricao.findMany({
      where: { eventoId },
      include: {
        usuario: { select: { id: true, nome: true, sobrenome: true, email: true, foto: true, tipo: true } },
      },
      orderBy: { createdAt: 'asc' },
    })
  }
}
