<script setup>
import { computed } from 'vue'

// ── Récupère le slug depuis l'URL ──
const route = useRoute()
const slug = route.params.slug

// console.log('Params complets :', route.params)
// console.log('Slug utilisé :', route.params.slug)

// ── Appel API ──
const { data, pending, error } = await useFetch(`/api/articles/${slug}`)

const article = computed(() => data.value?.article || null)

// ── Articles associés depuis l'API ──
const { data: relatedData } = await useFetch('/api/articles')

const COLORS = [
  { bg: 'bg-[#B5F23D]', text: 'text-gray-900' },
  { bg: 'bg-[#D8C4F0]', text: 'text-gray-900' },
  { bg: 'bg-[#FEE2CD]', text: 'text-gray-900' },
  { bg: 'bg-[#1a1a1a]', text: 'text-white' },
  { bg: 'bg-[#C8E6C9]', text: 'text-gray-900' },
]

const relatedArticles = computed(() => {
  const all = relatedData.value?.articles || []
  // Exclut l'article courant et prend 3 articles
  return all
    .filter(a => a.slug !== slug)
    .slice(0, 3)
    .map((a, i) => ({
      ...a,
      bgColor: COLORS[i % COLORS.length].bg,
      textColor: COLORS[i % COLORS.length].text,
    }))
})

// ── Helpers ──
const parseTags = (tags) => {
  try { return JSON.parse(tags) || [] }
  catch { return [] }
}

const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

// ── Carrousel ──
const currentIndex = ref(0)
const cardWidth = 260 + 16
const slideOffset = computed(() => currentIndex.value * cardWidth)
const nextSlide = () => { if (currentIndex.value < relatedArticles.value.length - 3) currentIndex.value++ }
const prevSlide = () => { if (currentIndex.value > 0) currentIndex.value-- }

// ── SEO ──
useHead({
  title: computed(() => article.value?.title || 'Article'),
  meta: [
    { name: 'description', content: computed(() => article.value?.excerpt || '') }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-white">

    <!-- Chargement -->
    <div v-if="pending" class="flex justify-center py-40">
      <div class="w-8 h-8 rounded-full border-4 border-gray-200 border-t-[#A8F000] animate-spin"></div>
    </div>

    <!-- Erreur / introuvable -->
    <div v-else-if="error || !article" class="flex flex-col items-center justify-center py-40 gap-4">
      <p class="text-gray-500 font-semibold">Article introuvable.</p>
      <NuxtLink to="/" class="text-sm font-bold underline">Retour à l'accueil</NuxtLink>
    </div>

    <!-- Article principal -->
    <article v-else class="max-w-4xl mx-auto px-20 py-12 pt-24">

      <div class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="tag in parseTags(article.tags)"
          :key="tag"
          class="text-xs font-semibold px-3 py-1 rounded-full bg-gray-100 text-gray-700"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Date -->
      <p class="text-lg text-gray-400 mb-3">  Date de publication: <span class="font-bold text-[#111111]">{{ formatDate(article.publishDate) }}</span></p>
      <!-- Titre -->
      <h1 class="text-3xl font-extrabold leading-tight text-gray-900 mb-6 md:text-4xl">
        {{ article.title }}
      </h1>

      <!-- Tags -->
     

      <!-- Image hero -->
      <div v-if="article.featuredImage" class="w-full rounded-2xl overflow-hidden mb-8" style="height: 500px;">
        <img
          :src="article.featuredImage"
          :alt="article.title"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- Contenu HTML de l'article -->
      <div
        class="prose prose-sm max-w-none"
        v-html="article.content"
      />

    </article>

    <!-- Section articles associés -->
    <section v-if="relatedArticles.length" class="bg-white border-t border-gray-100 px-20 py-12">
      <div class="max-w-4xl mx-auto">

        <h2 class="text-xl font-extrabold text-gray-900 mb-8 md:text-xl">
          Ceux-ci peuvent vous intéresser
        </h2>

        <div class="overflow-hidden">
          <div
            class="flex gap-4 transition-transform duration-500 ease-out"
            :style="`transform: translateX(-${slideOffset}px)`"
          >
            <article
              v-for="(related, i) in relatedArticles"
              :key="related.id"
              class="group rounded-2xl overflow-hidden flex flex-col shrink-0 cursor-pointer shadow-sm hover:shadow-xl transition-shadow duration-300 h-[300px]"
              style="width: 260px;"
            >
              <div class="p-4 flex-1" :class="related.bgColor">
                <div class="flex items-center gap-2 mb-3">
                  <span v-if="related.category" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-gray-800">
                    {{ related.category }}
                  </span>
                  <span v-if="parseTags(related.tags)[0]" class="text-xs font-semibold px-2.5 py-1 rounded-full bg-white/70 text-gray-800">
                    {{ parseTags(related.tags)[0] }}
                  </span>
                </div>
                <h3 class="text-base font-extrabold leading-tight" :class="related.textColor">
                  {{ related.title }}
                </h3>
              </div>

              <div class="relative overflow-hidden h-45">
                <img
                  v-if="related.featuredImage"
                  :src="related.featuredImage"
                  :alt="related.title"
                  class="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                <div v-else class="w-full h-full bg-gray-200"></div>
                <div class="absolute bottom-3 left-3">
                <NuxtLink
  :to="`/articles/${related.slug}`"
  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-white transition-all duration-200 hover:scale-105"
  style="background: #1a1a1a; border: 1px solid rgba(255,255,255,0.25);"
>
  Lire la suite
  <span class="w-4 h-4 rounded-full flex items-center justify-center" style="background: rgba(255,255,255,0.25);">
    <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5 12h14M12 5l7 7-7 7"/>
    </svg>
  </span>
</NuxtLink>
                </div>
              </div>
            </article>
          </div>
        </div>

      </div>
    </section>

  </div>
</template>