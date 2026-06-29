import path from 'path'
import fs from 'fs'
import { prisma } from '../../../config/prisma'

export class UpdateFotoService {
  async execute(userId: string, newFilePath: string) {
    // Remove foto antiga se existir
    const usuario = await prisma.usuario.findUnique({ where: { id: userId }, select: { foto: true } })
    if (usuario?.foto) {
      const oldPath = path.resolve(process.cwd(), usuario.foto.replace(/^\//, ''))
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath)
    }

    const fotoPath = `/uploads/${path.basename(newFilePath)}`
    return prisma.usuario.update({
      where: { id: userId },
      data: { foto: fotoPath },
      select: { id: true, foto: true, nome: true, sobrenome: true, email: true },
    })
  }
}
