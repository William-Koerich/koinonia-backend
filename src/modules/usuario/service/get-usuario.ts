import { UsuarioRepository } from "../repository/usuario";

export class GetUsuarioService {
  async execute(id: string) {
    const repository = new UsuarioRepository();
    const usuario = await repository.findById(id);
    if (!usuario) throw new Error("Usuário não encontrado");
    return usuario;
  }
}
