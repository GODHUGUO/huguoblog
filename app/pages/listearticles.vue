<template>
  <div class="px-16">

    <!-- Chargement -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#A8F000] animate-spin"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500 font-semibold">Erreur lors du chargement des articles.</p>
    </div>

    <!-- Aucun article -->
    <div v-else-if="allArticles.length === 0" class="text-center py-20">
      <p class="text-gray-400 font-medium">Aucun article pour l'instant.</p>
    </div>

    <!-- Liste -->
    <ul v-else class="space-y-3">
      <li
        v-for="article in visibleArticles"
        :key="article.id"
        class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-4 border-l-4"
        :style="{ borderLeftColor: getBorderColor(article.category) }"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <h3 class="font-semibold text-gray-900">{{ article.title }}</h3>
            <p class="text-sm text-gray-600 mt-1 line-clamp-2">{{ truncate(article.excerpt, 100) }}</p>

            <!-- Métadata -->
            <div class="flex items-center gap-3 mt-2">
              <span v-if="article.category" class="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                {{ article.category }}
              </span>
              <span class="text-xs text-gray-400">
                {{ formatDate(article.publishDate) }}
              </span>
              <span
                class="text-xs font-medium px-2 py-0.5 rounded-full"
                :class="article.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'"
              >
                {{ article.status === 'published' ? 'Publié' : 'Brouillon' }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-1 ml-4">
            <!-- Voir l'article → utilise le slug ✅ -->
            <NuxtLink
              :to="`/articles/${article.slug}`"
              class="p-2 hover:bg-gray-100 rounded-full transition-colors"
              :title="`Voir l'article: ${article.title}`"
            >
              <Icon name="heroicons:eye" class="w-5 h-5 text-gray-600 hover:text-[#A8F000]" />
            </NuxtLink>

            <!-- Supprimer -->
            <button
              @click="confirmDelete(article)"
              class="p-2 hover:bg-red-50 rounded-full transition-colors"
              :title="`Supprimer: ${article.title}`"
            >
              <Icon name="heroicons:trash" class="w-5 h-5 text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
      </li>
    </ul>

    <!-- Bouton Voir plus -->
    <div v-if="allArticles.length > INITIAL_COUNT && !showAll" class="mt-6 text-center">
      <button
        @click="showAll = true"
        class="px-6 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:opacity-80 transition-colors shadow-md"
      >
        Voir plus ({{ allArticles.length - INITIAL_COUNT }})
      </button>
    </div>

    <!-- Modal confirmation suppression -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="showDeleteModal = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <Icon name="heroicons:trash" class="w-5 h-5 text-red-500" />
            </div>
            <h3 class="text-base font-extrabold text-gray-900">Confirmer la suppression</h3>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            Êtes-vous sûr de vouloir supprimer
            <span class="font-semibold text-gray-900">"{{ articleToDelete?.title }}"</span> ?
            Cette action est irréversible.
          </p>
          <div class="flex justify-end gap-3">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 border border-gray-300 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button
              @click="deleteArticle"
              :disabled="deleting"
              class="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {{ deleting ? 'Suppression...' : 'Supprimer' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'dashboard'
})

// ── Récupération des articles ──
const { data, pending, error, refresh } = await useFetch('/api/articles')

const allArticles = computed(() => data.value?.articles || [])

// ── Pagination ──
const INITIAL_COUNT = 6
const showAll = ref(false)

const visibleArticles = computed(() => {
  return showAll.value ? allArticles.value : allArticles.value.slice(0, INITIAL_COUNT)
})

// ── Suppression ──
const showDeleteModal = ref(false)
const articleToDelete = ref(null)
const deleting = ref(false)

const confirmDelete = (article) => {
  articleToDelete.value = article
  showDeleteModal.value = true
}

const deleteArticle = async () => {
  if (!articleToDelete.value) return

  deleting.value = true
  try {
    await $fetch(`/api/articles/${articleToDelete.value.id}`, {
      method: 'DELETE'
    })
    showDeleteModal.value = false
    articleToDelete.value = null
    // Recharge la liste après suppression
    await refresh()
  } catch (err) {
    console.error('Erreur suppression :', err)
  } finally {
    deleting.value = false
  }
}

// ── Helpers ──
const truncate = (text, max = 100) => {
  if (!text) return ''
  const plain = text.replace(/<[^>]+>/g, '')
  return plain.length > max ? plain.substring(0, max) + '...' : plain
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const getBorderColor = (category) => {
  const colors = {
    'Web': '#3B82F6',
    'Framework': '#10B981',
    'Design': '#8B5CF6',
    'Backend': '#F59E0B',
    'Performance': '#EF4444',
    'Sécurité': '#F97316',
    'TypeScript': '#6366F1',
    'DevOps': '#6B7280',
    'Qualité': '#EC4899',
    'IA': '#06B6D4',
  }
  return colors[category] || '#A8F000'
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
</style>