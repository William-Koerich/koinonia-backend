import { Genero, EstadoCivil, TipoUsuario } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export interface CreateUsuarioDTO {
  email: string;
  senhaHash: string;
  foto?: string;
  nome: string;
  sobrenome: string;
  tipo?: TipoUsuario;
  ativo?: boolean;
  dataAniversario?: Date;
  genero?: Genero;
  estadoCivil?: EstadoCivil;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
}

export interface UpdateUsuarioDTO {
  email?: string;
  foto?: string;
  nome?: string;
  sobrenome?: string;
  tipo?: TipoUsuario;
  ativo?: boolean;
  dataAniversario?: Date;
  genero?: Genero;
  estadoCivil?: EstadoCivil;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
}

const PUBLIC_SELECT = {
  id: true,
  email: true,
  foto: true,
  nome: true,
  sobrenome: true,
  tipo: true,
  ativo: true,
  dataAniversario: true,
  genero: true,
  estadoCivil: true,
  logradouro: true,
  bairro: true,
  cidade: true,
  createdAt: true,
  updatedAt: true,
} as const;

export class UsuarioRepository {
  async create(data: CreateUsuarioDTO) {
    return prisma.usuario.create({ data });
  }

  async findAll() {
    return prisma.usuario.findMany({
      select: PUBLIC_SELECT,
      orderBy: { nome: "asc" },
    });
  }

  async findPaginated(opts: { q?: string; page?: number; limit?: number }) {
    const { q = "", page = 1, limit = 10 } = opts;
    const where = q
      ? {
          ativo: true,
          OR: [
            { nome: { contains: q, mode: "insensitive" as const } },
            { sobrenome: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : { ativo: true };

    const SELECT = { id: true, nome: true, sobrenome: true, foto: true, tipo: true };
    const [data, total] = await Promise.all([
      prisma.usuario.findMany({
        where,
        select: SELECT,
        orderBy: { nome: "asc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.usuario.count({ where }),
    ]);

    return { data, total, page, pages: Math.ceil(total / limit) || 1 };
  }

  async findById(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async findPublicById(id: string) {
    return prisma.usuario.findUnique({ where: { id }, select: PUBLIC_SELECT });
  }

  async update(id: string, data: UpdateUsuarioDTO) {
    return prisma.usuario.update({ where: { id }, data, select: PUBLIC_SELECT });
  }

  async delete(id: string) {
    return prisma.usuario.delete({ where: { id } });
  }
}
