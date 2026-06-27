import { UsuarioRepository } from "../repository/usuario";

export class ListUsuarioService {
  async execute() {
    const repository = new UsuarioRepository();
    return repository.findAll();
  }
}
