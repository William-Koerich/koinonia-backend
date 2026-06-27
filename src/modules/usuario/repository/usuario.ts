import { Genero, EstadoCivil } from "@prisma/client";
import { prisma } from "../../../config/prisma";

export interface CreateUsuarioDTO {
  email: string;
  senhaHash: string;
  foto?: string;
  nome: string;
  sobrenome: string;
  dataAniversario?: Date;
  genero?: Genero;
  estadoCivil?: EstadoCivil;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
}

export interface UpdateUsuarioDTO extends Partial<CreateUsuarioDTO> {}

export class UsuarioRepository {
  async create(data: CreateUsuarioDTO) {
    return prisma.usuario.create({ data });
  }

  async findAll() {
    return prisma.usuario.findMany({ orderBy: { nome: "asc" } });
  }

  async findById(id: string) {
    return prisma.usuario.findUnique({ where: { id } });
  }

  async update(id: string, data: UpdateUsuarioDTO) {
    return prisma.usuario.update({ where: { id }, data });
  }

  async delete(id: string) {
    return prisma.usuario.delete({ where: { id } });
  }
}
