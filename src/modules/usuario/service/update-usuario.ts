import { UpdateUsuarioDTO, UsuarioRepository } from "../repository/usuario";

export class UpdateUsuarioService {
  async execute(id: string, data: UpdateUsuarioDTO) {
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
