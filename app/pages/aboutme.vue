<template>
  <div class="min-h-screen bg-gray-50 mt-20">
    <!-- Hero Section -->
    <div class="bg-linear-to-r from-[#1a1a1a] to-gray-800 text-white">
      <div class="max-w-4xl mx-auto px-4 py-16 text-center">
        <h1 class="text-4xl md:text-5xl font-bold mb-4">À propos de moi</h1>
        <p class="text-xl text-gray-300 max-w-2xl mx-auto">
          Développeur passionné, créateur de ce blog pour partager mes connaissances et mon parcours
        </p>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="max-w-4xl mx-auto px-4 py-12">
      <!-- Photo et intro -->
      <div class="flex flex-col md:flex-row items-center gap-8 mb-12">
        <div class="w-40 h-40 rounded-full overflow-hidden border-4 border-[#A8F000] shadow-lg">
          <img 
            src="/images/profil.jpg" 
            alt="Photo de profil"
            class="w-full h-full object-cover"
          >
        </div>
        <div class="flex-1 text-center md:text-left">
          <h2 class="text-3xl font-bold text-gray-900 mb-2">Jean-Hugues GODONOU</h2>
          <p class="text-[#A8F000] font-medium mb-4">Développeur Front-end & Créateur de contenu</p>
          <p class="text-gray-600 leading-relaxed">
            Bienvenue sur mon blog ! Je suis développeur Front-end.J'ai créé cet espace pour partager mes connaissances, 
            mes expériences et aider la communauté à progresser dans le développement web.
          </p>
        </div>
      </div>



      <!-- Pourquoi ce blog -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        
          Pourquoi ce blog ?
        </h3>
        
      <div class="grid md:grid-cols-3 gap-6"> 

  <div class="text-center p-4">
    <div class="w-14 h-14 bg-[#A8F000] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon name="heroicons:academic-cap" class="w-32   border text-[#1a1a1a]" />
    </div>
    <h4 class="font-semibold mb-2">Partager mes connaissances</h4>
    <p class="text-sm text-gray-600">
      Transmettre ce que j'ai appris au fil des années pour aider les développeurs débutants.
    </p>
  </div>

  <div class="text-center p-4">
    <div class="w-14 h-14 bg-[#A8F000] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon name="heroicons:users" class="w-10 h-10 text-[#1a1a1a]" />
    </div>
    <h4 class="font-semibold mb-2">Créer une communauté</h4>
    <p class="text-sm text-gray-600">
      Échanger avec d'autres passionnés et créer des connexions autour du développement.
    </p>
  </div>

  <div class="text-center p-4">
    <div class="w-14 h-14 bg-[#A8F000] bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Icon name="heroicons:document-text" class="w-10 h-10 text-[#1a1a1a]" />
    </div>
    <h4 class="font-semibold mb-2">Documenter mon apprentissage</h4>
    <p class="text-sm text-gray-600">
      Garder une trace de mon évolution et des technologies que j'explore.
    </p>
  </div>

</div>

      </div>

      <!-- Mes compétences -->
      <div class="bg-white rounded-lg shadow-md p-8 mb-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="heroicons:code-bracket" class="w-6 h-6 text-[#A8F000]" />
          Mes compétences
        </h3>
        
        <div class="grid md:grid-cols-2 gap-6">
          <div v-for="skill in competences" :key="skill.name">
            <div class="flex justify-between mb-1">
              <span class="font-medium">{{ skill.name }}</span>
              <!-- <span class="text-sm text-gray-600">{{ skill.level }}%</span> -->
            </div>
            <div class="w-full bg-gray-200 rounded-full h-2">
              <div class="bg-[#A8F000] h-2 rounded-full" :style="{ width: skill.level + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Centres d'intérêt -->
      <!-- <div class="bg-white rounded-lg shadow-md p-8">
        <h3 class="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Icon name="heroicons:heart" class="w-6 h-6 text-[#A8F000]" />
          Mes passions
        </h3>
        
        <div class="flex flex-wrap gap-3">
          <span v-for="passion in passions" :key="passion" 
                class="px-4 py-2 bg-gray-100 rounded-full text-gray-700">
            {{ passion }}
          </span>
        </div>
      </div> -->
    </div>


  </div>
</template>

<script setup>
const parcours = [
  {
    annee: '2020 - Aujourd\'hui',
    description: 'Développeur Full Stack chez TechSolutions - Création d\'applications web avec Vue.js, Nuxt et Node.js'
  },
  {
    annee: '2018 - 2020',
    description: 'Développeur Frontend chez WebAgency - Spécialisation en React et Vue.js'
  },
  {
    annee: '2016 - 2018',
    description: 'Formation Développeur Web - OpenClassrooms - Obtention du diplôme avec mention'
  },
  {
    annee: '2014 - 2016',
    description: 'Étudiant en Informatique - Université - Découverte de la programmation'
  }
]

const competences = [
  { name: 'Nuxt', level: 100 },
  // { name: 'React', level: 75 },
  // { name: 'Node.js', level: 85 },
  { name: 'Tailwind CSS', level: 100 },
  // { name: 'JavaScript / TypeScript', level: 90 },
  { name: 'GSAP', level: 100 },
  // { name: 'PHP / Laravel', level: 70 }
]

const passions = [
  'Tennis 🎾', 
  'Développement personnel', 
  'Lecture', 
  'Voyages', 
  'Musique', 
  'Running', 
  'Café ☕', 
  'Jeux vidéo'
]
</script>