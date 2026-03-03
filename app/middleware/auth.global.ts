import { onAuthStateChanged, type User } from 'firebase/auth'

export default defineNuxtRouteMiddleware(async (to) => {
  if (import.meta.server) return

  const publicPages = ['/', '/login', '/register'];
  const isPublicPage = publicPages.includes(to.path);

  const { $auth } = useNuxtApp() as unknown as { $auth: ReturnType<typeof import('firebase/auth').getAuth> };

  if (!$auth) return;

  const user = await new Promise<User | null>((resolve) => {
    const unsubscribe = onAuthStateChanged($auth, (firebaseUser) => {
      unsubscribe();
      resolve(firebaseUser);
    });
  });

  // Connecté + login ou register seulement → redirige (pas la page d'accueil)
  if (user && (to.path === '/login' || to.path === '/register')) {
    return navigateTo('/createarticle');
  }

  // Non connecté + page protégée → login
  if (!user && !isPublicPage) {
    return navigateTo({
      path: '/login',
      query: { redirect: to.fullPath }
    });
  }
});