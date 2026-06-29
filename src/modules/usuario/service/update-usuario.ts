import { TipoUsuario, Genero, EstadoCivil } from "@prisma/client";
import { UsuarioRepository } from "../repository/usuario";

export interface UpdateUsuarioInput {
  nome?: string;
  sobrenome?: string;
  email?: string;
  foto?: string;
  tipo?: TipoUsuario;
  ativo?: boolean;
  dataAniversario?: string;
  genero?: Genero;
  estadoCivil?: EstadoCivil;
  logradouro?: string;
  bairro?: string;
  cidade?: string;
}

export class UpdateUsuarioService {
  async execute(id: string, data: UpdateUsuarioInput) {
    const repository = new UsuarioRepository();
    const exists = await repository.findById(id);
    if (!exists) throw new Error("Usuário não encontrado");
    return repository.update(id, {
      ...data,
      dataAniversario: data.dataAniversario
        ? new Date(data.dataAniversario)
        : undefined,
    });
  }
}
