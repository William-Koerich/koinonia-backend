import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { Request } from 'express'

const uploadsDir = path.resolve(process.cwd(), 'uploads')
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    const userId = req.userId ?? 'usuario'
    cb(null, `${userId}-${Date.now()}${ext}`)
  },
})

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

export const uploadFoto = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
})
