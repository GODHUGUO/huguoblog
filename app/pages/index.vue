<template>
  <section class="w-full px-6 py-10 max-w-7xl mx-auto" style="font-family: 'Syne', sans-serif;">

    <!-- En-tête -->
    <div class="flex items-start justify-between mt-16 mb-4">
      <p class="text-xl font-semibold text-[#1a1a1a] mb-3">Mes articles</p>
    </div>

    <!-- Chargement -->
    <div v-if="pending" class="flex justify-center py-20">
      <div class="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#A8F000] animate-spin"></div>
    </div>

    <!-- Erreur -->
    <div v-else-if="error" class="text-center py-20">
      <p class="text-red-500 font-semibold">Erreur lors du chargement des articles.</p>
    </div>

    <!-- Aucun article -->
    <div v-else-if="visibleArticles.length === 0" class="text-center py-20">
      <p class="text-gray-400 font-medium">Aucun article publié pour l'instant.</p>
    </div>

    <!-- Grille d'articles -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <article
        v-for="(article, index) in visibleArticles"
        :key="article.id"
        class="group relative rounded-2xl overflow-hidden shadow-xl"
        :style="{ backgroundColor: getColor(index).bg, minHeight: '420px' }"
      >
        <!-- Tags en haut -->
        <div class="absolute top-4 left-4 flex items-center gap-2 z-10">
          <span v-if="article.category" class="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-gray-800">
            {{ article.category }}
          </span>
          <span v-if="parseTags(article.tags)[0]" class="text-xs font-semibold px-3 py-1 rounded-full bg-white/90 text-gray-800">
            {{ parseTags(article.tags)[0] }}
          </span>
        </div>

        <!-- Contenu texte -->
        <div class="absolute top-16 left-4 right-4 z-10">
          <h3
            class="text-2xl font-extrabold leading-tight mb-2"
            :style="{ color: getColor(index).text }"
          >
            {{ article.title }}
          </h3>
          <!-- <p
            class="text-sm leading-relaxed"
            :style="{ color: getColor(index).desc }"
          >
          
            {{ truncate(article.excerpt, 50) }}
          </p> -->
        </div>

        <!-- Image en bas -->
        <div class="absolute bottom-0 left-0 right-0 h-72 overflow-hidden rounded-2xl">
          <img
            v-if="article.featuredImage"
            :src="article.featuredImage"
            :alt="article.title"
            class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
          <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center">
            <svg class="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
          </div>
        </div>

        <!-- Bouton Lire la suite → /articles/[slug] -->
        <div class="absolute bottom-4 left-4 z-10">
          <NuxtLink
            :to="`/articles/${article.slug}`"
            class="flex items-center gap-2 bg-white/90 hover:bg-white text-gray-900 text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:shadow-md"
          >
            Lire la suite
            <span class="w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
              <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </NuxtLink>
        </div>
      </article>
    </div>

    <!-- Bouton Voir plus -->
    <div v-if="!showAll && (data?.articles?.length ?? 0) > INITIAL_COUNT" class="flex justify-center mt-12">
      <button
        @click="showAll = true"
        class="flex items-center gap-3 px-8 py-3.5 rounded-full bg-[#1a1a1a] text-white text-sm font-semibold hover:bg-gray-700 active:scale-95 transition-all duration-200"
      >
        Voir plus d'articles
        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </button>
    </div>

    <div v-else-if="showAll && visibleArticles.length > 0" class="flex justify-center mt-12">
      <p class="text-sm text-gray-400 font-medium">Vous avez vu tous les articles ✓</p>
    </div>

  </section>
</template>

<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'default'
})

// ── Palette de couleurs aléatoires ──
// Chaque entrée : bg (fond carte), text (titre), desc (description)
const COLORS = [
  { bg: '#B5F23D', text: '#1a1a1a', desc: '#6b7280' },
  { bg: '#D8C4F0', text: '#1a1a1a', desc: '#4b5563' },
  { bg: '#F5F0E8', text: '#1a1a1a', desc: '#6b7280' },
  { bg: '#1a1a1a', text: '#ffffff', desc: '#9ca3af' },
  { bg: '#FEE2CD', text: '#1a1a1a', desc: '#4b5563' },
  { bg: '#C8E6C9', text: '#1a1a1a', desc: '#374151' },
  { bg: '#DBEAFE', text: '#1a1a1a', desc: '#4b5563' },
  { bg: '#FFF3CD', text: '#1a1a1a', desc: '#374151' },
  { bg: '#F3E8FF', text: '#1a1a1a', desc: '#4b5563' },
  { bg: '#FFE4E6', text: '#1a1a1a', desc: '#374151' },
]

// Retourne une couleur selon l'index (cycle sur la palette)
const getColor = (index) => COLORS[index % COLORS.length]

// ── Récupération des articles depuis l'API ──
const { data, pending, error } = await useFetch('/api/articles')
// console.log('Articles reçus :', JSON.stringify(data.value, null, 2))
// ── Helpers ──
const parseTags = (tags) => {
  try {
    return JSON.parse(tags) || []
  } catch {
    return []
  }
}

// ✅ Tronque le texte à n caractères et ajoute "..."
const truncate = (text, maxLength = 100) => {
  if (!text) return ''
  // Supprime les balises HTML si l'excerpt contient du HTML
  const plain = text.replace(/<[^>]+>/g, '')
  return plain.length > maxLength ? plain.substring(0, maxLength) + '...' : plain
}

// ── Pagination ──
const INITIAL_COUNT = 6
const showAll = ref(false)

const visibleArticles = computed(() => {
  const list = data.value?.articles || []
  return showAll.value ? list : list.slice(0, INITIAL_COUNT)
})

</script>