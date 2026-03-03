// server/api/articles/[slug].delete.ts
import { db } from '../../db/index'
import { articles } from '../../db/shema'
import { eq } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  const param = getRouterParam(event, 'slug') // ✅ même nom que les autres fichiers

  if (!param) {
    throw createError({ statusCode: 400, message: 'ID manquant' })
  }

  const deleted = await db
    .delete(articles)
    .where(eq(articles.id, parseInt(param))) // ✅ on parse en int pour supprimer par ID
    .returning()

  if (!deleted.length) {
    throw createError({ statusCode: 404, message: 'Article introuvable' })
  }

  return {
    success: true,
    message: 'Article supprimé avec succès'
  }
})