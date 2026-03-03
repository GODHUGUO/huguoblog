// Ce fichier = la route /images/[n'importe-quoi]
import { blob } from 'hub:blob'

export default eventHandler(async (event) => {
  
  // Récupère ce qu'il y a après /images/
  // ex: /images/123-mon-article.jpg  →  pathname = "123-mon-article.jpg"
  const pathname = getRouterParam(event, 'pathname')
  
  // Si y'a rien après /images/, on retourne 404
  if (!pathname) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }

  // Va chercher le fichier dans R2 et l'envoie au navigateur
  return blob.serve(event, pathname)
})
