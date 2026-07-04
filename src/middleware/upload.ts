import multer from 'multer'
import path from 'path'
import { Request } from 'express'

const fileFilter = (
  _req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback,
) => {
  const allowed = ['.jpg', '.jpeg', '.png', '.webp']
  if (allowed.includes(path.extname(file.originalname).toLowerCase())) {
    cb(null, true)
  } else {
    cb(new Error('Apenas imagens são aceitas (jpg, jpeg, png, webp)'))
  }
}

// Memory storage: files available at req.file.buffer, uploaded to Cloudinary
const memStorage = multer.memoryStorage()
const opts = { storage: memStorage, fileFilter, limits: { fileSize: 15 * 1024 * 1024 } }

export const uploadFoto = multer(opts)
export const uploadFotoEvento = multer(opts)
export const uploadComprovante = multer(opts)
