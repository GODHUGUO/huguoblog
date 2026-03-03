import { blob } from 'hub:blob'
import slugify from 'slugify'

export default defineEventHandler(async (event) => {
  // Récupère le fichier envoyé
  const formData = await readFormData(event)
  const file = formData.get('file') as File

  if (!file) {
    throw createError({ statusCode: 400, message: 'Aucun fichier reçu' })
  }

  // Génère un nom unique
  const ext = file.name.split('.').pop()
  const filename = `content/${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${ext}`

  // Convertit en buffer et uploade sur R2
  const buffer = Buffer.from(await file.arrayBuffer())

  await blob.put(filename, buffer, {
    contentType: file.type,
    addRandomSuffix: false
  })

  return {
    url: `/images/${filename}`
  }
})