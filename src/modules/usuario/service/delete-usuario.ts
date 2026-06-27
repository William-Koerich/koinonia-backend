import { UsuarioRepository } from "../repository/usuario";

export class DeleteUsuarioService {
  async execute(id: string) {
    const repository = new UsuarioRepository();
    const exists = await repository.findById(id);
    if (!exists) throw new Error("Usuário não encontrado");
    return repository.delete(id);
  }
}
