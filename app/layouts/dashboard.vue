<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Sidebar -->
    <div
      class="fixed inset-y-0 left-0 z-50 w-64 bg-[#1a1a1a] text-white shadow-xl transition-transform duration-300 ease-in-out lg:translate-x-0 -translate-x-full"
      :class="{ 'translate-x-0': isMobileMenuOpen }"
    >
      <div class="flex flex-col h-full">
        <!-- Logo -->
        <div class="shrink-0 mt-4 rounded-3xl px-4 py-1 flex items-center justify-center">
          <img
            src="/images/logoblogdeclinaison.png"
            alt="Bannière"
            class="w-24 object-cover rounded-lg"
          />
        </div>
        <!-- Navigation -->
        <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <div v-for="item in navigation" :key="item.name">
            <!-- Section avec sous-menus -->
            <div v-if="item.children">
              <button
                @click="toggleSection(item.name)"
                class="w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
                :class="{ 'bg-gray-800': openSections.includes(item.name) }"
              >
                <div class="flex items-center">
                  <Icon :name="item.icon" class="w-5 h-5 mr-3" style="color: #A8F000;" />
                  <span>{{ item.name }}</span>
                </div>
                <Icon
                  name="heroicons:chevron-down"
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': openSections.includes(item.name) }"
                />
              </button>
              <div v-show="openSections.includes(item.name)" class="mt-1 ml-11 space-y-1">
                <NuxtLink
                  v-for="child in item.children"
                  :key="child.name"
                  :to="child.path"
                  @click="closeMobileMenu"
                  class="block px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  active-class="bg-gray-800 text-white"
                >
                  {{ child.name }}
                </NuxtLink>
              </div>
            </div>
            <!-- Lien simple -->
            <NuxtLink
              v-else
              :to="item.path"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors"
              :class="{
                'bg-gray-800 text-white': $route.path === item.path,
                'text-gray-300 hover:text-white hover:bg-gray-800': $route.path !== item.path,
              }"
            >
              <Icon :name="item.icon" class="w-5 h-5 mr-3" style="color: #A8F000;" />
              <span>{{ item.name }}</span>
            </NuxtLink>
          </div>
        </nav>
        <!-- User info -->
        <div class="p-4 border-t border-gray-800">
          <div class="flex items-center">
            <div class="ml-3">
              <p class="text-sm font-medium text-white">Jean-Hugues Godonou</p>
              <p class="text-xs text-gray-400">jeanhuguesgodonou@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Overlay pour fermer le menu sur mobile (clic dans le vide) -->
    <div
      v-if="isMobileMenuOpen"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
      @click="closeMobileMenu"
    />

    <!-- Main content -->
    <div class="lg:ml-64">
      <!-- Top bar -->
      <header class="bg-white shadow-sm sticky top-0 z-20">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center">
            <!-- Hamburger menu (visible seulement sur petits écrans) -->
            <button
              @click="toggleMobileMenu"
              class="lg:hidden p-2 -ml-2 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <Icon name="heroicons:bars-3" class="w-6 h-6 text-gray-600" />
            </button>
            <!-- Titre -->
            <h2 class="text-xl font-semibold text-gray-800 ml-4">{{ pageTitle }}</h2>
          </div>
          <div class="flex items-center space-x-4">
            <!-- Search -->
            <!-- Notifications -->
            <button class="p-2 hover:bg-gray-100 rounded-full relative">
              <Icon name="heroicons:bell" class="w-5 h-5 text-gray-600" />
              <span class="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>
        </div>
      </header>
      <!-- Page Content via Slot -->
      <main class="p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
const route = useRoute()

// État du menu mobile
const isMobileMenuOpen = ref(false)

// Fonctions pour ouvrir/fermer le menu mobile
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}
const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Fermer le menu mobile quand on change de page
watch(
  () => route.path,
  () => {
    closeMobileMenu()
  }
)

// État des sections ouvertes
const openSections = ref(['Articles'])

// Navigation avec icônes Heroicons
const navigation = [
  {
    name: 'Articles',
    icon: 'heroicons:document-text',
    children: [
      { name: 'Tous les articles', path: '/listearticles' },
      { name: 'Nouvel article', path: '/createarticle' },
    ],
  },
]

// Titre de la page basé sur la route
const pageTitle = computed(() => {
  const path = route.path
  if (path === '/') return 'Tableau de bord'
  if (path === '/articles') return 'Tous les articles'
  if (path === '/articles/nouveau') return 'Nouvel article'
  if (path === '/categories') return 'Catégories'
  if (path === '/mediatheque') return 'Médiathèque'
  if (path === '/profil') return 'Mon profil'
  if (path === '/utilisateurs') return 'Utilisateurs'
  if (path === '/parametres') return 'Paramètres'
  return 'Tableau de bord'
})

// Ouvrir la section Articles si on est sur une route d'articles
watchEffect(() => {
  if (route.path.startsWith('/articles')) {
    if (!openSections.value.includes('Articles')) {
      openSections.value.push('Articles')
    }
  }
})

const toggleSection = (section) => {
  if (openSections.value.includes(section)) {
    openSections.value = openSections.value.filter((s) => s !== section)
  } else {
    openSections.value.push(section)
  }
}
</script>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
::-webkit-scrollbar-track {
  background: #f1f1f1;
}
::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style>