// drizzle.config.ts
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/db/shema.ts',          // chemin vers ton schema.ts
  out: './drizzle',                         // dossier où les migrations seront générées
  dialect: 'sqlite',                        // obligatoire
  // NE METS PAS "driver" ici pour SQLite local avec better-sqlite3
  // Drizzle Kit le détecte automatiquement si tu as better-sqlite3 installé
  dbCredentials: {
    url: './.data/db/sqlite.db',                // chemin relatif vers ton fichier .db
  },
});