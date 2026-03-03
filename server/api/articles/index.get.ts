import { db } from '../../db/index'
import { articles } from '../../db/shema'
import { desc } from 'drizzle-orm'

export default defineEventHandler(async () => {
  const allArticles = await db
    .select()
    .from(articles)
    .orderBy(desc(articles.publishDate))

  return {
    success: true,
    articles: allArticles
  }
})