<template>
  <nav 
    class="fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300"
    :class="isScrolled 
      ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
      : 'bg-white/90 backdrop-blur-sm shadow-none'"
  >
    <!-- Barre principale -->
    <div class="flex items-center  justify-between gap-6 px-6 py-3 max-w-7xl mx-auto  ">
      <!-- Logo -->
      <div class="shrink-0 bg-[#A8F000] rounded-3xl px-4 py-1">
        <img
          src="/images/logoblog.png"
          alt="Bannière"
          class="w-24 object-cover rounded-lg"
        />
      </div>

      <!-- Liens desktop -->
      <ul class="hidden md:flex items-center gap-1 list-none m-0 p-0 bg-[#1a1a1a] px-4 py-2 rounded-3xl border">
        <li>
          <NuxtLink
            to="/"
            class="text-sm font-medium text-white px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
            active-class="font-semibold text-gray-900"
          >Accueil</NuxtLink>
        </li>
        <!-- <li>
          <NuxtLink
            to="/"
            class="text-sm font-medium text-white px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
            active-class="font-semibold text-gray-900"
          >Blog</NuxtLink>
        </li> -->
        <li>
          <NuxtLink
            to="/aboutme"
            class="text-sm font-medium text-white px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
            active-class="font-semibold text-gray-900"
          >À propos</NuxtLink>
        </li>
        <li>
          <NuxtLink
            to="/contact"
            class="text-sm font-medium text-white px-3 py-1.5 rounded-full transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900"
            active-class="font-semibold text-gray-900"
          >Contact</NuxtLink>
        </li>
      </ul>

      <!-- Actions droite -->
      <div class="flex items-center gap-3 ">

 <NuxtLink to="/" class="flex items-center gap-3">
        <div
          class="w-6 h-4 rounded-full flex items-center justify-center bg-[#A8F000] font-bold"
        
          aria-label="HuguoBlog logo"
        >
          
        </div>
      </NuxtLink>

        <!-- Se connecter (desktop) -->
        <NuxtLink
          to="/login"
          class="hidden md:flex items-center text-sm font-medium text-white px-4 py-2 rounded-full bg-[#1a1a1a] transition-all duration-200
           hover:bg-gray-800"
        >
          Se connecter
          <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </NuxtLink>

  <NuxtLink to="/" class="flex items-center gap-3">
        <div
          class="w-6 h-4 rounded-full flex items-center justify-center bg-[#A8F000] font-bold"  aria-label="HuguoBlog logo"
        >
        </div>
      </NuxtLink>
        <!-- Bouton hamburger (mobile) -->
        <button
          @click="toggleMenu"
          :aria-expanded="menuOpen"
          aria-label="Ouvrir le menu"
          class="md:hidden flex flex-col justify-center items-center gap-1.25 w-10 h-10 rounded-full bg-[#1a1a1a] px-2.5 cursor-pointer transition-all duration-200 hover:bg-[#2a2a2a]"
        >
          <span
            class="block h-0.5 w-4 bg-white rounded-full transition-all duration-300 origin-center"
            :class="{ 'rotate-45 translate-y-1.75': menuOpen }"
          ></span>
          <span
            class="block h-0.5 w-4 bg-white rounded-full transition-all duration-300"
            :class="{ 'opacity-0 scale-x-0': menuOpen }"
          ></span>
          <span
            class="block h-0.5 w-4 bg-white rounded-full transition-all duration-300 origin-center"
            :class="{ '-rotate-45 -translate-y-1.75': menuOpen }"
          ></span>
        </button>
      </div>



      
    </div>

    <!-- Menu mobile déroulant -->
    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-3"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-3"
    >
      <div
        v-if="menuOpen"
        class="md:hidden absolute top-full left-0 right-0 z-50 bg-white border-t border-gray-100 shadow-lg rounded-b-2xl"
      >
        <ul class="flex flex-col list-none m-0 p-4 gap-1">
          <li>
            <NuxtLink
              to="/"
              class="block text-base font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              active-class="bg-[#A8F000]/20 text-gray-900 font-semibold"
              @click="closeMenu"
            >Accueil</NuxtLink>
          </li>
          <li>
            <!-- <NuxtLink
              to="/"
              class="block text-base font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              active-class="bg-[#A8F000]/20 text-gray-900 font-semibold"
              @click="closeMenu"
            >Blog</NuxtLink> -->
          </li>
          <li>
            <NuxtLink
              to="/aboutme"
              class="block text-base font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              active-class="bg-[#A8F000]/20 text-gray-900 font-semibold"
              @click="closeMenu"
            >À propos</NuxtLink>
          </li>
          <li>
            <NuxtLink
              to="/contact"
              class="block text-base font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150"
              active-class="bg-[#A8F000]/20 text-gray-900 font-semibold"
              @click="closeMenu"
            >Contact</NuxtLink>
          </li>
          <li class="pt-2 border-t border-gray-100">
            <NuxtLink
              to="/login"
              class="flex items-center text-base font-medium text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-50 transition-colors duration-150"
              @click="closeMenu"
            >
              Se connecter
              <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const menuOpen = ref(false)
const isScrolled = ref(false)

const toggleMenu = () => {
  menuOpen.value = !menuOpen.value
}

const closeMenu = () => {
  menuOpen.value = false
}

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

const handleOutsideClick = (event) => {
  const nav = document.querySelector('nav')
  if (nav && !nav.contains(event.target)) {
    menuOpen.value = false
  }
}

const router = useRouter()
router.afterEach(() => {
  menuOpen.value = false
})

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  document.addEventListener('click', handleOutsideClick)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.removeEventListener('click', handleOutsideClick)
})
</script>