import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export function uploadToCloudinary(buffer: Buffer, folder = 'koinonia'): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: 'image' }, (err, result) => {
        if (err || !result) return reject(err ?? new Error('Upload falhou'))
        resolve(result.secure_url)
      })
      .end(buffer)
  })
}

export function deleteFromCloudinary(url: string): void {
  try {
    // Extract public_id from URL: .../koinonia/folder/filename.ext → koinonia/folder/filename
    const match = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[^.]+$/)
    if (match) cloudinary.uploader.destroy(match[1]).catch(() => {})
  } catch {}
}
