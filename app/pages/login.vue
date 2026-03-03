<template>
  <div
    class="min-h-screen flex items-center justify-center p-4"
    style="background-color: #ffffff; font-family: 'Syne', sans-serif;"
  >
    <div
      class="relative w-full max-w-xl rounded-3xl overflow-hidden p-10 md:p-16"
      style="background: radial-gradient(ellipse at 80% 20%, #2a2a2a 0%, #1a1a1a 50%, #0f0f0f 100%); min-height: 220px;"
    >
      <div class="flex flex-col items-center max-w-xs mx-auto w-full">
        <!-- Logo -->
        <div class="shrink-0 bg-[#A8F000] rounded-3xl px-4 py-1 mb-2">
          <img src="/images/logoblog.png" alt="Bannière" class="w-24 object-cover rounded-lg" />
        </div>

        <!-- Titre -->
        <h1 class="text-2xl font-extrabold text-white text-center mb-2">
          Yooo, welcome back!
        </h1>

        <div class="w-full flex flex-col gap-3">
          <!-- Email -->
          <div>
            <input
              v-model="email"
              type="email"
              placeholder="Your email"
              class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-600 outline-none transition-all duration-200"
              style="background-color: #111111; border: 1px solid #2e2e2e;"
              @focus="e => e.target.style.borderColor = '#B5F23D'"
              @blur="e => e.target.style.borderColor = fieldErrors.email ? '#ef4444' : '#2e2e2e'"
            />
            <p v-if="fieldErrors.email" class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors.email }}</p>
          </div>

          <!-- Mot de passe -->
          <div>
            <div class="relative">
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-gray-500 outline-none transition-all duration-200"
                style="background-color: #111111; border: 1px solid #2e2e2e;"
                @focus="e => e.target.style.borderColor = '#B5F23D'"
                @blur="e => e.target.style.borderColor = fieldErrors.password ? '#ef4444' : '#2e2e2e'"
              />
              <button
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-300 transition-colors duration-150"
                type="button"
              >
                <svg v-if="!showPassword" class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                </svg>
              </button>
            </div>
            <p v-if="fieldErrors.password" class="text-red-500 text-xs mt-1 ml-1">{{ fieldErrors.password }}</p>
          </div>

          <!-- Bouton -->
          <button
            @click="handleSignIn"
            :disabled="loading"
            class="w-full py-3 rounded-xl text-sm font-bold text-[#1a1a1a] transition-all duration-200 hover:opacity-90 active:scale-95 mt-1"
            style="background-color: #A8F000;"
          >
            {{ loading ? 'Connexion...' : 'Se connecter' }}
          </button>

          <!-- Erreur globale -->
          <p v-if="error" class="text-red-500 text-sm text-center mt-2">{{ error }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({ layout: false })

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const fieldErrors = ref({ email: '', password: '' })

const validate = () => {
  fieldErrors.value = { email: '', password: '' }
  let valid = true

  if (!email.value.trim()) {
    fieldErrors.value.email = 'L\'email est requis'
    valid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) {
    fieldErrors.value.email = 'Format email invalide'
    valid = false
  }

  if (!password.value) {
    fieldErrors.value.password = 'Le mot de passe est requis'
    valid = false
  } else if (password.value.length < 6) {
    fieldErrors.value.password = 'Minimum 6 caractères'
    valid = false
  }

  return valid
}

const handleSignIn = async () => {
  if (!validate()) return  // 👈 bloque si champs invalides

  loading.value = true
  error.value = ''

  try {
    const { signInWithEmailAndPassword } = await import('firebase/auth')
    const { auth } = await import('../plugins/firebase.client')

    await signInWithEmailAndPassword(auth, email.value.trim(), password.value)
    await navigateTo('/createarticle')
  } catch (err) {
    switch (err.code) {
      case 'auth/invalid-email':
        fieldErrors.value.email = 'Format email invalide'
        break
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':  // 👈 ajouté
        error.value = 'Email ou mot de passe incorrect'
        break
      case 'auth/too-many-requests':
        error.value = 'Trop de tentatives. Réessaie plus tard'
        break
      default:
        error.value = 'Problème de connexion, réessaie'
    }
  } finally {
    loading.value = false
  }
}
</script>