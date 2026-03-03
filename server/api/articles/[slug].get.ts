import { db } from '../../db/index'
import { articles } from '../../db/shema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')
console.log('Slug reçu par l\'API :', slug)
  if (!slug) {
    throw createError({ statusCode: 400, message: 'Slug manquant' })
  }

  const article = await db
    .select()
    .from(articles)
    .where(eq(articles.slug, slug))
    .limit(1)

  if (!article.length) {
    throw createError({ statusCode: 404, message: 'Article introuvable' })
  }

  return {
    success: true,
    article: article[0]
  }
})