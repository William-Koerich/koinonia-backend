import { CreateUsuarioDTO, UsuarioRepository } from "../repository/usuario";

export class CreateUsuarioService {
  async execute(data: CreateUsuarioDTO) {
    const repository = new UsuarioRepository();
    return repository.create({
      ...data,
      tipo: "ADMIN", // TODO: remover após testes
      dataAniversario: data.dataAniversario ? new Date(data.dataAniversario) : undefined,
    });
  }
}
