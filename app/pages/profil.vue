<template>
  <div class="max-w-3xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Mon profil</h1>
    
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- En-tête avec photo de profil -->
      <div class="bg-gradient-to-r from-[#1a1a1a] to-gray-800 p-8 text-white">
        <div class="flex items-center gap-6">
          <!-- Avatar avec upload -->
          <div class="relative group">
            <div class="w-24 h-24 rounded-full bg-[#A8F000] flex items-center justify-center text-[#1a1a1a] font-bold text-3xl overflow-hidden">
              <img v-if="avatarPreview || profile.avatar" 
                   :src="avatarPreview || profile.avatar" 
                   :alt="profile.fullName"
                   class="w-full h-full object-cover">
              <span v-else>{{ userInitials }}</span>
            </div>
            
            <!-- Overlay au survol pour changer l'avatar -->
            <label class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
              <Icon name="heroicons:camera" class="w-6 h-6 text-white" />
              <input type="file" class="hidden" accept="image/*" @change="handleAvatarChange">
            </label>
          </div>
          
          <div>
            <h2 class="text-2xl font-bold">{{ profile.fullName || 'GODONOU Jean-Hugues' }}</h2>
            <p class="text-gray-300">{{ profile.email || 'jeanhuguesgodonou@gmail.com' }}</p>
          </div>
        </div>
      </div>

      <!-- Navigation des onglets -->
      <div class="border-b border-gray-200">
        <nav class="flex px-6">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-4 py-3 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.id 
              ? 'border-[#A8F000] text-[#A8F000]' 
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- Contenu des onglets -->
      <div class="p-6">
        <!-- ONGLET: Informations personnelles -->
        <div v-if="activeTab === 'info'" class="space-y-6">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Informations personnelles</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
              <input 
                v-model="profile.firstName" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
                placeholder="Thomas"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">Nom</label>
              <input 
                v-model="profile.lastName" 
                type="text" 
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
                placeholder="Admin"
              >
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              v-model="profile.email" 
              type="email" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
              placeholder="admin@tennis.com"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Bio</label>
            <textarea 
              v-model="profile.bio" 
              rows="4"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
              placeholder="Parlez un peu de vous, votre expérience, votre passion pour le tennis..."
            ></textarea>
            <p class="text-xs text-gray-500 mt-1">Maximum 200 caractères</p>
          </div>
        </div>

        <!-- ONGLET: Mot de passe -->
        <div v-if="activeTab === 'password'" class="space-y-6 max-w-md">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Changer le mot de passe</h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe actuel</label>
            <input 
              v-model="password.current" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
            <input 
              v-model="password.new" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Confirmer le nouveau mot de passe</label>
            <input 
              v-model="password.confirm" 
              type="password" 
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
          </div>

          <!-- Indicateur de force du mot de passe -->
          <div v-if="password.new" class="space-y-2">
            <div class="flex gap-1">
              <div v-for="i in 4" :key="i" 
                   class="h-2 flex-1 rounded-full transition-all"
                   :class="passwordStrength >= i ? 'bg-[#A8F000]' : 'bg-gray-200'">
              </div>
            </div>
            <div class="flex justify-between items-center">
              <p class="text-xs text-gray-500">{{ passwordStrengthText }}</p>
              <p v-if="password.new && password.confirm" class="text-xs" :class="passwordsMatch ? 'text-green-600' : 'text-red-600'">
                {{ passwordsMatch ? '✓ Mots de passe identiques' : '✗ Les mots de passe ne correspondent pas' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer avec boutons d'action -->
      <div class="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
        <button 
          @click="resetForm"
          class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
        >
          Annuler
        </button>
        <button 
          @click="saveProfile"
          class="px-6 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
          :disabled="isSaving"
        >
          {{ isSaving ? 'Enregistrement...' : 'Enregistrer les modifications' }}
        </button>
      </div>
    </div>

    <!-- Toast de notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in-up">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'

definePageMeta({
  layout: 'dashboard' 
})

// État
const activeTab = ref('info')
const isSaving = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const avatarPreview = ref(null)

// Tabs
const tabs = [
  { id: 'info', label: 'Informations' },
  { id: 'password', label: 'Mot de passe' }
]

// Données du profil
const profile = reactive({
  firstName: 'GODONOU',
  lastName: 'Jean-Hhugues',
  email: 'jeanhuguesgodonou@gmail.com',
  bio: 'développeur Front-end. Je partage mes connaissances à travers ce blog.',
  avatar: ''
})

// Nom complet calculé
const fullName = computed(() => {
  return `${profile.firstName} ${profile.lastName}`.trim() || ''
})

// Initiales pour l'avatar par défaut
const userInitials = computed(() => {
  return (profile.firstName?.[0] || 'J') + (profile.lastName?.[0] || 'H')
})

// Mot de passe
const password = reactive({
  current: '',
  new: '',
  confirm: ''
})

// Validation des mots de passe
const passwordsMatch = computed(() => {
  return password.new && password.confirm && password.new === password.confirm
})

// Force du mot de passe
const passwordStrength = computed(() => {
  if (!password.new) return 0
  let strength = 0
  if (password.new.length >= 8) strength++
  if (/[A-Z]/.test(password.new)) strength++
  if (/[0-9]/.test(password.new)) strength++
  if (/[^A-Za-z0-9]/.test(password.new)) strength++
  return strength
})

const passwordStrengthText = computed(() => {
  const texts = ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort']
  return texts[passwordStrength.value]
})

// Gestion de l'avatar
const handleAvatarChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    // Prévisualisation
    avatarPreview.value = URL.createObjectURL(file)
    
    // Ici tu ferais l'upload vers ton serveur
    console.log('Fichier sélectionné:', file.name)
  }
}

// Sauvegarde
const saveProfile = async () => {
  // Validation du mot de passe si l'onglet actif est password
  if (activeTab.value === 'password') {
    if (!password.current) {
      showToastMessage('Veuillez entrer votre mot de passe actuel', 'error')
      return
    }
    if (!password.new) {
      showToastMessage('Veuillez entrer un nouveau mot de passe', 'error')
      return
    }
    if (!passwordsMatch.value) {
      showToastMessage('Les nouveaux mots de passe ne correspondent pas', 'error')
      return
    }
    if (passwordStrength.value < 2) {
      showToastMessage('Le mot de passe est trop faible', 'error')
      return
    }
  }

  isSaving.value = true
  
  try {
    // Simuler un appel API
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Ici tu ferais l'appel API pour sauvegarder
    const dataToSave = {
      ...profile,
      avatar: avatarPreview.value || profile.avatar
    }
    
    if (activeTab.value === 'password') {
      dataToSave.newPassword = password.new
    }
    
    console.log('Données sauvegardées:', dataToSave)
    
    // Réinitialiser les champs de mot de passe après sauvegarde
    if (activeTab.value === 'password') {
      password.current = ''
      password.new = ''
      password.confirm = ''
    }
    
    showToastMessage('Profil mis à jour avec succès')
  } catch (error) {
    showToastMessage('Erreur lors de la sauvegarde', 'error')
  } finally {
    isSaving.value = false
  }
}

// Réinitialisation
const resetForm = () => {
  // Recharger les données depuis le serveur ou état initial
  profile.firstName = 'Thomas'
  profile.lastName = 'Admin'
  profile.email = 'thomas@tennis.com'
  profile.bio = 'Passionné de tennis et développeur web. Je partage mes connaissances à travers ce blog.'
  profile.avatar = ''
  avatarPreview.value = null
  
  password.current = ''
  password.new = ''
  password.confirm = ''
  
  showToastMessage('Modifications annulées')
}

// Toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}

/* Style pour le bouton désactivé */
button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>