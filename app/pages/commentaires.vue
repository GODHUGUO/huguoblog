<template>
  <div class="p-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Modération des commentaires</h1>
      
      <!-- Statistiques rapides -->
      <div class="flex gap-4 text-sm">
        <div class="bg-white px-3 py-1 rounded-full shadow-sm">
          Total: <span class="font-bold">{{ totalComments }}</span>
        </div>
        <div class="bg-yellow-100 px-3 py-1 rounded-full">
          En attente: <span class="font-bold">{{ pendingCount }}</span>
        </div>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <!-- Filtres par statut -->
        <div class="flex gap-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.value"
            @click="filterStatus = tab.value"
            class="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            :class="filterStatus === tab.value 
              ? 'bg-[#A8F000] text-[#1a1a1a]' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'"
          >
            {{ tab.label }}
            <span class="ml-2 text-xs bg-white bg-opacity-30 px-2 py-0.5 rounded-full">
              {{ tab.count }}
            </span>
          </button>
        </div>

        <!-- Recherche -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Rechercher un commentaire..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <!-- Tri -->
        <select 
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
        >
          <option value="date-desc">Plus récents</option>
          <option value="date-asc">Plus anciens</option>
          <option value="article">Par article</option>
          <option value="author">Par auteur</option>
        </select>
      </div>
    </div>

    <!-- Liste des commentaires -->
    <div class="space-y-4">
      <div 
        v-for="comment in filteredComments" 
        :key="comment.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"
        :class="{ 'border-l-4 border-yellow-400': comment.status === 'pending' }"
      >
        <!-- En-tête du commentaire -->
        <div class="p-4 border-b border-gray-100 bg-gray-50 rounded-t-lg">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <!-- Avatar -->
              <div class="w-8 h-8 rounded-full bg-[#A8F000] bg-opacity-20 flex items-center justify-center text-[#A8F000] font-bold">
                {{ comment.authorInitials }}
              </div>
              
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium">{{ comment.author }}</span>
                  <span class="text-xs text-gray-500">•</span>
                  <span class="text-xs text-gray-500">{{ comment.date }}</span>
                  <span 
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="{
                      'bg-yellow-100 text-yellow-800': comment.status === 'pending',
                      'bg-green-100 text-green-800': comment.status === 'approved',
                      'bg-red-100 text-red-800': comment.status === 'spam',
                      'bg-gray-100 text-gray-800': comment.status === 'trash'
                    }"
                  >
                    {{ getStatusLabel(comment.status) }}
                  </span>
                </div>
                <NuxtLink 
                  :to="`/articles/${comment.articleId}`" 
                  class="text-xs text-blue-600 hover:text-blue-800"
                >
                  Sur: {{ comment.articleTitle }}
                </NuxtLink>
              </div>
            </div>

            <!-- Actions rapides -->
            <div class="flex gap-1">
              <button 
                v-if="comment.status !== 'approved'"
                @click="approveComment(comment)"
                class="p-2 hover:bg-green-100 rounded-full transition-colors"
                title="Approuver"
              >
                <Icon name="heroicons:check" class="w-5 h-5 text-green-600" />
              </button>
              <button 
                v-if="comment.status !== 'spam'"
                @click="markAsSpam(comment)"
                class="p-2 hover:bg-orange-100 rounded-full transition-colors"
                title="Marquer comme spam"
              >
                <Icon name="heroicons:exclamation-triangle" class="w-5 h-5 text-orange-600" />
              </button>
              <button 
                @click="confirmDelete(comment)"
                class="p-2 hover:bg-red-100 rounded-full transition-colors"
                title="Mettre à la corbeille"
              >
                <Icon name="heroicons:trash" class="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
        </div>

        <!-- Corps du commentaire -->
        <div class="p-4">
          <p class="text-gray-800">{{ comment.content }}</p>
          
          <!-- Actions supplémentaires -->
          <div class="flex items-center gap-4 mt-3">
            <button 
              @click="replyToComment(comment)"
              class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
            >
              <Icon name="heroicons:chat-bubble-left-ellipsis" class="w-4 h-4" />
              Répondre
            </button>
            <button 
              @click="editComment(comment)"
              class="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600"
            >
              <Icon name="heroicons:pencil-square" class="w-4 h-4" />
              Modifier
            </button>
          </div>

          <!-- Réponse existante -->
          <div v-if="comment.reply" class="mt-3 pl-4 border-l-2 border-gray-200">
            <div class="flex items-center gap-2 mb-1">
              <span class="text-xs font-medium text-[#A8F000]">Votre réponse:</span>
              <span class="text-xs text-gray-500">{{ comment.replyDate }}</span>
            </div>
            <p class="text-sm text-gray-700">{{ comment.reply }}</p>
          </div>
        </div>
      </div>

      <!-- Message si aucun commentaire -->
      <div v-if="filteredComments.length === 0" class="text-center py-12">
        <Icon name="heroicons:chat-bubble-left-right" class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-gray-500">Aucun commentaire à afficher</p>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center mt-6 gap-2">
      <button 
        @click="currentPage--"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Précédent
      </button>
      <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
      <button 
        @click="currentPage++"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Suivant
      </button>
    </div>

    <!-- Modal de réponse -->
    <div v-if="showReplyModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showReplyModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Répondre au commentaire</h3>
        
        <div class="mb-4 p-3 bg-gray-50 rounded-lg">
          <p class="text-sm font-medium">{{ replyingTo?.author }}</p>
          <p class="text-sm text-gray-600 mt-1">{{ replyingTo?.content }}</p>
        </div>
        
        <textarea 
          v-model="replyText"
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
          placeholder="Votre réponse..."
        ></textarea>
        
        <div class="flex justify-end gap-3 mt-4">
          <button 
            @click="showReplyModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="sendReply"
            class="px-4 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de modification -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showEditModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Modifier le commentaire</h3>
        
        <textarea 
          v-model="editingText"
          rows="4"
          class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
        ></textarea>
        
        <div class="flex justify-end gap-3 mt-4">
          <button 
            @click="showEditModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="saveEdit"
            class="px-4 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80"
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de confirmation suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showDeleteModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir déplacer ce commentaire vers la corbeille ?
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="moveToTrash"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Mettre à la corbeille
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
definePageMeta({
  layout: 'dashboard' 
})

// État
const filterStatus = ref('pending')
const searchQuery = ref('')
const sortBy = ref('date-desc')
const currentPage = ref(1)
const commentsPerPage = 10

// Modaux
const showReplyModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const replyingTo = ref(null)
const editingComment = ref(null)
const editingText = ref('')
const commentToDelete = ref(null)
const replyText = ref('')

// Données simulées des commentaires
const allComments = ref([
  {
    id: 1,
    author: 'Jean Dupont',
    authorInitials: 'JD',
    content: 'Super article ! J\'ai testé l\'exercice et mon revers est déjà plus propre. Merci pour les conseils.',
    date: '2024-01-15 14:30',
    articleId: 3,
    articleTitle: 'Comment améliorer son revers',
    status: 'pending',
    reply: null
  },
  {
    id: 2,
    author: 'Marie Martin',
    authorInitials: 'MM',
    content: 'Est-ce que cet exercice convient aux enfants de 8 ans ? Je cherche des activités pour mon fils.',
    date: '2024-01-15 09:15',
    articleId: 3,
    articleTitle: 'Comment améliorer son revers',
    status: 'pending',
    reply: null
  },
  {
    id: 3,
    author: 'Pierre Durand',
    authorInitials: 'PD',
    content: 'Très bonne introduction au développement web. Hâte de lire la suite !',
    date: '2024-01-14 18:45',
    articleId: 1,
    articleTitle: 'Les bases du développement web',
    status: 'approved',
    reply: 'Merci Pierre ! Le prochain article arrive la semaine prochaine.',
    replyDate: '2024-01-15 10:30'
  },
  {
    id: 4,
    author: 'Sophie Bernard',
    authorInitials: 'SB',
    content: 'Article très complet, bravo ! Une petite faute à la ligne 3 mais sinon c\'est parfait.',
    date: '2024-01-14 11:20',
    articleId: 2,
    articleTitle: 'Maîtriser Vue.js & Nuxt',
    status: 'approved',
    reply: null
  },
  {
    id: 5,
    author: 'Lucas Petit',
    authorInitials: 'LP',
    content: 'Merci pour ces explications claires !',
    date: '2024-01-13 16:50',
    articleId: 1,
    articleTitle: 'Les bases du développement web',
    status: 'approved',
    reply: null
  },
  {
    id: 6,
    author: 'Claire Fontaine',
    authorInitials: 'CF',
    content: 'Quand commence la prochaine session pour les juniors ?',
    date: '2024-01-13 10:05',
    articleId: 4,
    articleTitle: 'Programmes Juniors - Nouvelle session',
    status: 'pending',
    reply: null
  },
  {
    id: 7,
    author: 'SpamBot123',
    authorInitials: 'SB',
    content: 'Achetez des montres pas chères sur mon site...',
    date: '2024-01-12 22:10',
    articleId: 1,
    articleTitle: 'Les bases du développement web',
    status: 'spam',
    reply: null
  },
  {
    id: 8,
    author: 'Thomas Leroy',
    authorInitials: 'TL',
    content: 'Excellent contenu, continuez comme ça !',
    date: '2024-01-12 15:40',
    articleId: 5,
    articleTitle: 'Optimisation des performances',
    status: 'approved',
    reply: null
  }
])

// Statistiques
const totalComments = computed(() => allComments.value.length)
const pendingCount = computed(() => allComments.value.filter(c => c.status === 'pending').length)
const approvedCount = computed(() => allComments.value.filter(c => c.status === 'approved').length)
const spamCount = computed(() => allComments.value.filter(c => c.status === 'spam').length)
const trashCount = computed(() => allComments.value.filter(c => c.status === 'trash').length)

// Tabs de filtrage
const tabs = computed(() => [
  { label: 'Tous', value: 'all', count: totalComments.value },
  { label: 'En attente', value: 'pending', count: pendingCount.value },
  { label: 'Approuvés', value: 'approved', count: approvedCount.value },
  { label: 'Spam', value: 'spam', count: spamCount.value },
  { label: 'Corbeille', value: 'trash', count: trashCount.value }
])

// Libellés des statuts
const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    approved: 'Approuvé',
    spam: 'Spam',
    trash: 'Corbeille'
  }
  return labels[status] || status
}

// Filtrage et recherche
const filteredComments = computed(() => {
  let filtered = [...allComments.value]
  
  // Filtre par statut
  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(c => c.status === filterStatus.value)
  }
  
  // Recherche textuelle
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(c => 
      c.content.toLowerCase().includes(query) ||
      c.author.toLowerCase().includes(query) ||
      c.articleTitle.toLowerCase().includes(query)
    )
  }
  
  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date)
      case 'date-asc':
        return new Date(a.date) - new Date(b.date)
      case 'article':
        return a.articleTitle.localeCompare(b.articleTitle)
      case 'author':
        return a.author.localeCompare(b.author)
      default:
        return 0
    }
  })
  
  return filtered
})

// Pagination
const totalPages = computed(() => 
  Math.ceil(filteredComments.value.length / commentsPerPage)
)

const paginatedComments = computed(() => {
  const start = (currentPage.value - 1) * commentsPerPage
  const end = start + commentsPerPage
  return filteredComments.value.slice(start, end)
})

// Actions sur les commentaires
const approveComment = (comment) => {
  comment.status = 'approved'
  // Ici tu ferais un appel API
}

const markAsSpam = (comment) => {
  comment.status = 'spam'
}

const replyToComment = (comment) => {
  replyingTo.value = comment
  replyText.value = ''
  showReplyModal.value = true
}

const sendReply = () => {
  if (replyText.value.trim() && replyingTo.value) {
    replyingTo.value.reply = replyText.value
    replyingTo.value.replyDate = new Date().toLocaleDateString('fr-FR')
    replyingTo.value.status = 'approved'
    showReplyModal.value = false
    replyingTo.value = null
    replyText.value = ''
  }
}

const editComment = (comment) => {
  editingComment.value = comment
  editingText.value = comment.content
  showEditModal.value = true
}

const saveEdit = () => {
  if (editingText.value.trim() && editingComment.value) {
    editingComment.value.content = editingText.value
    showEditModal.value = false
    editingComment.value = null
    editingText.value = ''
  }
}

const confirmDelete = (comment) => {
  commentToDelete.value = comment
  showDeleteModal.value = true
}

const moveToTrash = () => {
  if (commentToDelete.value) {
    commentToDelete.value.status = 'trash'
    showDeleteModal.value = false
    commentToDelete.value = null
  }
}
</script>