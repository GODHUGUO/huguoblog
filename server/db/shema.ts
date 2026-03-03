import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const articles = sqliteTable('articles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  content: text('content').notNull(),
  excerpt: text('excerpt'),
  featuredImage: text('featured_image'),
  category: text('category'),
  tags: text('tags'), // on stocke en JSON stringifié
  author: text('author').notNull().default('Jean-Hugues GODONOU'),
  status: text('status').notNull().default('draft'), // draft, published
  publishDate: text('publish_date').notNull(), // ISO string
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  createdAt: text('created_at').default(new Date().toISOString()),
  updatedAt: text('updated_at').default(new Date().toISOString()),
});
