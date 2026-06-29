import multer from 'multer'
import path from 'path'
import fs from 'fs'
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

function createUpload(subdir?: string) {
  const dir = subdir
    ? path.resolve(process.cwd(), 'uploads', subdir)
    : path.resolve(process.cwd(), 'uploads')

  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })

  const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (req: Request, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase()
      const userId = req.userId ?? 'anon'
      cb(null, `${userId}-${Date.now()}${ext}`)
    },
  })

  return multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } })
}

export const uploadFoto = createUpload()
export const uploadFotoEvento = createUpload('eventos')
export const uploadComprovante = createUpload('comprovantes')
