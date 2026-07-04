import { prisma } from '../../../config/prisma'
import { uploadToCloudinary, deleteFromCloudinary } from '../../../config/cloudinary'

export class UpdateFotoService {
  async execute(userId: string, buffer: Buffer) {
    const usuario = await prisma.usuario.findUnique({ where: { id: userId }, select: { foto: true } })

    // Delete old photo from Cloudinary if it was stored there
    if (usuario?.foto && usuario.foto.startsWith('https://res.cloudinary.com')) {
      deleteFromCloudinary(usuario.foto)
    }

    const url = await uploadToCloudinary(buffer, 'koinonia/usuarios')

    return prisma.usuario.update({
      where: { id: userId },
      data: { foto: url },
      select: { id: true, foto: true, nome: true, sobrenome: true, email: true },
    })
  }
}
