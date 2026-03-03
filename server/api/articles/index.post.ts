import { db } from '../../db/index'
import { articles } from '../../db/shema'
import { blob } from 'hub:blob'
import slugify from 'slugify'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Validation
  if (!body.title?.trim()) {
    throw createError({ statusCode: 400, message: 'Le titre est obligatoire' })
  }

  if (!body.content?.trim()) {
    throw createError({ statusCode: 400, message: 'Le contenu est obligatoire' })
  }

  if (!body.featuredImage || body.featuredImage.trim() === '') {
    throw createError({ statusCode: 400, message: "L'image à la une est obligatoire" })
  }

  // Gestion de l'image
  let featuredImageUrl: string | null = null

  if (body.featuredImage.startsWith('data:image')) {
    const matches = body.featuredImage.match(/^data:image\/([A-Za-z-+]+);base64,(.+)$/)

    if (!matches || matches.length !== 3) {
      throw createError({ statusCode: 400, message: "Format d'image invalide" })
    }

    // ✅ Tous les formats supportés
    const mimeToExt: Record<string, string> = {
      'jpeg': 'jpg',
      'jpg': 'jpg',
      'png': 'png',
      'gif': 'gif',
      'webp': 'webp',
      'svg+xml': 'svg',
      'avif': 'avif',
    }
    const ext = mimeToExt[matches[1]] || matches[1]

    const buffer = Buffer.from(matches[2], 'base64')
    const filename = `${Date.now()}-${slugify(body.title || 'article', { lower: true })}.${ext}`

    const uploaded = await blob.put(filename, buffer, {
      contentType: `image/${matches[1]}`,
      addRandomSuffix: false
    })

    featuredImageUrl = `/images/${uploaded.pathname}`
  } else {
    featuredImageUrl = body.featuredImage
  }

  // Slug
  const slug = slugify(body.title.trim(), {
    lower: true,
    strict: true,
    trim: true
  })

  // Objet article
  const newArticle = {
    title: body.title.trim(),
    slug,
    content: body.content,
    excerpt: body.excerpt || body.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...',
    featuredImage: featuredImageUrl,
    category: body.category || null,
    tags: body.tags ? JSON.stringify(body.tags) : '[]',
    author: body.author || 'HUGUO',
    status: body.status || 'draft',
    publishDate: body.publishDate || new Date().toISOString(),
    metaTitle: body.metaTitle || body.title,
    metaDescription: body.metaDescription || body.excerpt || '',
  }

  const inserted = await db.insert(articles).values(newArticle).returning()

  return {
    success: true,
    article: inserted[0],
    message: 'Article créé avec succès'
  }
})