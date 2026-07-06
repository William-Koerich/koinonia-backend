import { UsuarioRepository } from "../repository/usuario";

export class ListUsuarioService {
  async execute(opts?: { q?: string; page?: number; limit?: number }) {
    const repository = new UsuarioRepository();
    if (opts?.page !== undefined) {
      return repository.findPaginated(opts);
    }
    return repository.findAll();
  }
}
