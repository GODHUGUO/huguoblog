<template>
  <div class="max-w-2xl mx-auto py-8 px-4">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Gestion des catégories</h1>
    
    <!-- Formulaire d'ajout -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
      <div class="flex gap-3">
        <input 
          v-model="newCategory" 
          type="text" 
          placeholder="Nouvelle catégorie..."
          class="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
          @keyup.enter="addCategory"
        >
        <button 
          @click="addCategory"
          class="px-6 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium"
          :disabled="!newCategory.trim()"
        >
          Ajouter
        </button>
      </div>
    </div>

    <!-- Liste des catégories -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <ul class="space-y-2">
        <li 
          v-for="category in categories" 
          :key="category.id"
          class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
        >
          <span>{{ category.name }}</span>
          <button 
            @click="deleteCategory(category.id)"
            class="text-red-600 hover:text-red-800"
          >
            <Icon name="heroicons:trash" class="w-5 h-5" />
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
definePageMeta({
  layout: 'dashboard' 
})
const newCategory = ref('')
const categories = ref([])

onMounted(() => {
  const saved = localStorage.getItem('categories-simple')
  categories.value = saved ? JSON.parse(saved) : []
})

const saveCategories = () => {
  localStorage.setItem('categories-simple', JSON.stringify(categories.value))
}

const addCategory = () => {
  const name = newCategory.value.trim()
  if (!name) return
  
  categories.value.push({
    id: Date.now(),
    name: name
  })
  
  saveCategories()
  newCategory.value = ''
}

const deleteCategory = (id) => {
  if (confirm('Supprimer cette catégorie ?')) {
    categories.value = categories.value.filter(c => c.id !== id)
    saveCategories()
  }
}
</script>