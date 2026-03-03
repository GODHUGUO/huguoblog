<template>
  <div class="min-h-screen bg-gray-50 mt-16">
    <!-- Hero Section -->
    <div class="bg-linear-to-r from-[#1a1a1a] to-gray-800 text-white">
      <div class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">Me contacter</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Une question, une suggestion ou juste envie d'échanger ? Je suis là !
        </p>
      </div>
    </div>


    <!-- Contenu principal -->
    <div class="max-w-4xl mx-auto px-4 py-12">
      <div class="grid md:grid-cols-1 gap-8">
        <!-- Colonne gauche - Infos de contact -->
        <div class="">
          <div class="bg-white rounded-lg shadow-md p-6 sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-6">Informations</h2>
            
            <div class="space-y-4">
              <!-- Email -->
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-[#A8F000] bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon name="heroicons:envelope" class="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Email</p>
                  <a href="mailto:thomas@tennis.com" class="text-gray-900 hover:text-[#A8F000]">
                    jeanhuguesgodonou@gmail.com
                  </a>
                </div>
              </div>

              <!-- Téléphone -->
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-[#A8F000] bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon name="heroicons:phone" class="w-5 h-5 text-[#1a1a1a]" />
                </div>
                <div> 
                  <p class="text-sm text-gray-500">Whatsapp</p>
          
                    +229 67 10 70 15
                 
                </div>
              </div>

              <!-- Localisation -->
              <div class="flex items-start gap-3">
                <div class="w-10 h-10 bg-[#A8F000] bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
                  <Icon name="heroicons:map-pin" class="w-5 h-5 text-[#A8F000]" />
                </div>
                <div>
                  <p class="text-sm text-gray-500">Localisation</p>
                  <p class="text-gray-900">Cotonou, Bénin</p>
                </div>
              </div>
            </div>

            <!-- Réseaux sociaux -->
            <!-- <div class="mt-8 pt-6 border-t border-gray-200">
              <h3 class="font-semibold mb-4">Réseaux sociaux</h3>

              <div class="flex gap-3">
                <a href="#" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#A8F000] hover:text-[#1a1a1a] transition-colors">
                  <Icon name="heroicons:briefcase" class="w-5 h-5" />
                </a>
                <a href="#" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#A8F000] hover:text-[#1a1a1a] transition-colors">
                  <Icon name="heroicons:chat-bubble-left-right" class="w-5 h-5" />
                </a>
                <a href="#" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#A8F000] hover:text-[#1a1a1a] transition-colors">
                  <Icon name="heroicons:user-group" class="w-5 h-5" />
                </a>
                <a href="#" class="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-[#A8F000] hover:text-[#1a1a1a] transition-colors">
                  <Icon name="heroicons:video-camera" class="w-5 h-5" />
                </a>
              </div>

            </div> -->

            <!-- Disponibilité -->
          
          </div>
        </div>

       
      </div>

      <!-- Carte / Section supplémentaire -->
      <div class="mt-8 bg-white rounded-lg shadow-md p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Pourquoi me contacter ?</h3>
        
        <div class="grid md:grid-cols-3 gap-6">
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#A8F000] bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
              <Icon name="heroicons:question-mark-circle" class="w-4 h-4 text-[#1a1a1a]" />
            </div>
            <p class="text-sm text-gray-600">Une question sur un article ou un sujet technique</p>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#A8F000] bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
              <Icon name="heroicons:light-bulb" class="w-4 h-4 text-[#1a1a1a]" />
            </div>
            <p class="text-sm text-gray-600">Une suggestion de sujet pour un futur article</p>
          </div>
          
          <div class="flex items-start gap-3">
            <div class="w-8 h-8 bg-[#A8F000] bg-opacity-20 rounded-lg flex items-center justify-center shrink-0">
              <Icon name="heroicons:hand-raised" class="w-4 h-4 text-[#1a1a1a]" />
            </div>
            <p class="text-sm text-gray-600">Une proposition de collaboration ou de projet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const isSubmitting = ref(false)
const showConfirmation = ref(false)

const form = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const submitForm = async () => {
  isSubmitting.value = true
  
  // Simuler un envoi (à remplacer par un vrai appel API)
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  console.log('Formulaire soumis:', form)
  
  // Réinitialiser le formulaire
  form.name = ''
  form.email = ''
  form.subject = ''
  form.message = ''
  
  // Afficher la confirmation
  showConfirmation.value = true
  isSubmitting.value = false
  
  // Masquer la confirmation après 5 secondes
  setTimeout(() => {
    showConfirmation.value = false
  }, 5000)
}
</script>

<style scoped>
@keyframes ping {
  75%, 100% {
    transform: scale(2);
    opacity: 0;
  }
}
.animate-ping {
  animation: ping 1s cubic-bezier(0, 0, 0.2, 1) infinite;
}
</style>