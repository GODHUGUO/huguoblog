<template>
  <div class="p-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Médiathèque</h1>
      
      <!-- Bouton upload -->
      <button 
        @click="showUploadModal = true"
        class="flex items-center gap-2 px-4 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
      >
        <Icon name="heroicons:cloud-arrow-up" class="w-5 h-5" />
        Uploader un fichier
      </button>
    </div>

    <!-- Filtres et recherche -->
    <div class="bg-white rounded-lg shadow-md p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <!-- Recherche -->
        <div class="flex-1 min-w-[200px]">
          <div class="relative">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Rechercher un fichier..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <!-- Filtre par type -->
        <select 
          v-model="filterType"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
        >
          <option value="all">Tous les types</option>
          <option value="image">Images</option>
          <option value="video">Vidéos</option>
          <option value="document">Documents</option>
        </select>

        <!-- Tri -->
        <select 
          v-model="sortBy"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
        >
          <option value="date-desc">Plus récents</option>
          <option value="date-asc">Plus anciens</option>
          <option value="name-asc">Nom (A-Z)</option>
          <option value="name-desc">Nom (Z-A)</option>
        </select>

        <!-- Vue grille/liste -->
        <div class="flex gap-1 border border-gray-300 rounded-lg overflow-hidden">
          <button 
            @click="viewMode = 'grid'"
            class="p-2"
            :class="viewMode === 'grid' ? 'bg-[#A8F000] bg-opacity-20' : 'hover:bg-gray-100'"
          >
            <Icon name="heroicons:squares-2x2" class="w-5 h-5" />
          </button>
          <button 
            @click="viewMode = 'list'"
            class="p-2"
            :class="viewMode === 'list' ? 'bg-[#A8F000] bg-opacity-20' : 'hover:bg-gray-100'"
          >
            <Icon name="heroicons:bars-3" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Total fichiers</p>
        <p class="text-2xl font-bold">{{ media.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Images</p>
        <p class="text-2xl font-bold">{{ imagesCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Vidéos</p>
        <p class="text-2xl font-bold">{{ videosCount }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Documents</p>
        <p class="text-2xl font-bold">{{ documentsCount }}</p>
      </div>
    </div>

    <!-- Contenu principal -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <!-- Vue en grille -->
      <div v-if="viewMode === 'grid'" class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div 
          v-for="file in filteredMedia" 
          :key="file.id"
          class="relative group cursor-pointer"
          @click="openFileDetails(file)"
        >
          <!-- Aperçu selon le type -->
          <div class="aspect-square bg-gray-100 rounded-lg overflow-hidden border-2 border-transparent hover:border-[#A8F000] transition-all">
            <!-- Image -->
            <img 
              v-if="file.type === 'image'"
              :src="file.url" 
              :alt="file.name"
              class="w-full h-full object-cover"
            >
            
            <!-- Vidéo -->
            <div v-else-if="file.type === 'video'" class="w-full h-full bg-gray-900 flex items-center justify-center">
              <video 
                v-if="file.preview"
                :src="file.url" 
                class="w-full h-full object-cover"
              />
              <div v-else class="text-center">
                <Icon name="heroicons:video-camera" class="w-8 h-8 text-gray-400 mx-auto" />
                <p class="text-xs text-gray-500 mt-1">Vidéo</p>
              </div>
            </div>
            
            <!-- Document -->
            <div v-else class="w-full h-full bg-gray-50 flex items-center justify-center">
              <Icon name="heroicons:document-text" class="w-8 h-8 text-gray-400" />
            </div>

            <!-- Type de fichier badge -->
            <span class="absolute top-2 left-2 px-2 py-1 bg-black bg-opacity-50 text-white text-xs rounded">
              {{ file.type }}
            </span>

            <!-- Actions au survol -->
            <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button 
                @click.stop="viewFile(file)"
                class="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Voir"
              >
                <Icon name="heroicons:eye" class="w-4 h-4" />
              </button>
              <button 
                @click.stop="editFile(file)"
                class="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Modifier"
              >
                <Icon name="heroicons:pencil-square" class="w-4 h-4" />
              </button>
              <button 
                @click.stop="confirmDelete(file)"
                class="p-2 bg-white rounded-full hover:bg-gray-100"
                title="Supprimer"
              >
                <Icon name="heroicons:trash" class="w-4 h-4 text-red-600" />
              </button>
            </div>
          </div>

          <!-- Infos fichier -->
          <div class="mt-2">
            <p class="text-sm font-medium truncate">{{ file.name }}</p>
            <p class="text-xs text-gray-500">{{ file.size }} • {{ file.usedIn }} article(s)</p>
          </div>
        </div>
      </div>

      <!-- Vue en liste -->
      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="text-left text-sm text-gray-500 border-b">
              <th class="pb-3">Fichier</th>
              <th class="pb-3">Nom</th>
              <th class="pb-3">Type</th>
              <th class="pb-3">Taille</th>
              <th class="pb-3">Date</th>
              <th class="pb-3">Utilisations</th>
              <th class="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="file in filteredMedia" 
              :key="file.id"
              class="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
              @click="openFileDetails(file)"
            >
              <td class="py-3 w-12">
                <div class="w-10 h-10 bg-gray-100 rounded overflow-hidden">
                  <img v-if="file.type === 'image'" :src="file.url" class="w-full h-full object-cover">
                  <div v-else class="w-full h-full flex items-center justify-center">
                    <Icon :name="getFileIcon(file.type)" class="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </td>
              <td class="py-3 font-medium">{{ file.name }}</td>
              <td class="py-3 text-sm">{{ file.type }}</td>
              <td class="py-3 text-sm">{{ file.size }}</td>
              <td class="py-3 text-sm">{{ file.date }}</td>
              <td class="py-3 text-sm">{{ file.usedIn }}</td>
              <td class="py-3">
                <div class="flex gap-2">
                  <button @click.stop="viewFile(file)" class="text-blue-600 hover:text-blue-800">Voir</button>
                  <button @click.stop="editFile(file)" class="text-green-600 hover:text-green-800">Modifier</button>
                  <button @click.stop="confirmDelete(file)" class="text-red-600 hover:text-red-800">Suppr.</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Message si aucun résultat -->
      <div v-if="filteredMedia.length === 0" class="text-center py-12 text-gray-500">
        Aucun fichier trouvé
      </div>
    </div>

    <!-- Modal d'upload -->
    <div v-if="showUploadModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showUploadModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Uploader un fichier</h3>
        
        <div 
          class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#A8F000] transition-colors cursor-pointer"
          @click="triggerFileInput"
          @dragover.prevent
          @drop.prevent="handleDrop"
        >
          <input 
            ref="fileInput"
            type="file" 
            multiple
            class="hidden"
            @change="handleFileSelect"
            accept="image/*,video/*,.pdf,.doc,.docx"
          >
          
          <Icon name="heroicons:cloud-arrow-up" class="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p class="text-gray-700 mb-2">Cliquez ou glissez vos fichiers ici</p>
          <p class="text-xs text-gray-500">Images, vidéos, PDF, documents (max 10MB)</p>
        </div>

        <!-- Liste des fichiers sélectionnés -->
        <div v-if="selectedFiles.length > 0" class="mt-4">
          <h4 class="font-medium mb-2">Fichiers sélectionnés ({{ selectedFiles.length }})</h4>
          <div class="space-y-2 max-h-40 overflow-y-auto">
            <div v-for="file in selectedFiles" :key="file.name" class="flex items-center justify-between text-sm">
              <span class="truncate">{{ file.name }}</span>
              <span class="text-gray-500">{{ formatFileSize(file.size) }}</span>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 mt-6">
          <button 
            @click="showUploadModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="uploadFiles"
            class="px-4 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            :disabled="selectedFiles.length === 0"
          >
            Uploader
          </button>
        </div>
      </div>
    </div>

    <!-- Modal détails fichier -->
    <div v-if="showFileModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showFileModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6 relative z-10">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-lg font-semibold text-gray-900">Détails du fichier</h3>
          <button @click="showFileModal = false" class="text-gray-400 hover:text-gray-600">
            <Icon name="heroicons:x-mark" class="w-6 h-6" />
          </button>
        </div>

        <div v-if="selectedFile" class="space-y-4">
          <!-- Aperçu -->
          <div class="bg-gray-100 rounded-lg p-4 flex justify-center">
            <img 
              v-if="selectedFile.type === 'image'"
              :src="selectedFile.url" 
              class="max-h-64 object-contain"
            >
            <video 
              v-else-if="selectedFile.type === 'video'"
              :src="selectedFile.url" 
              controls
              class="max-h-64"
            />
            <div v-else class="text-center py-8">
              <Icon :name="getFileIcon(selectedFile.type)" class="w-16 h-16 text-gray-400 mx-auto" />
              <p class="text-gray-600 mt-2">Document: {{ selectedFile.name }}</p>
            </div>
          </div>

          <!-- Informations -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm text-gray-500">Nom du fichier</label>
              <input 
                v-model="selectedFile.name"
                type="text"
                class="w-full px-3 py-2 border rounded-lg mt-1"
              >
            </div>
            <div>
              <label class="block text-sm text-gray-500">Type</label>
              <p class="mt-1">{{ selectedFile.type }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Taille</label>
              <p class="mt-1">{{ selectedFile.size }}</p>
            </div>
            <div>
              <label class="block text-sm text-gray-500">Date d'upload</label>
              <p class="mt-1">{{ selectedFile.date }}</p>
            </div>
          </div>

          <!-- Utilisations -->
          <div>
            <label class="block text-sm text-gray-500 mb-2">Utilisé dans les articles</label>
            <div class="space-y-2">
              <div v-for="i in selectedFile.usedIn" :key="i" class="flex items-center gap-2 text-sm">
                <span>Article #{{ i }}</span>
                <button class="text-blue-600 hover:text-blue-800">Voir</button>
              </div>
              <p v-if="selectedFile.usedIn === 0" class="text-sm text-gray-400">Non utilisé</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4 border-t">
            <button class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              Télécharger
            </button>
            <button 
              @click="saveFileDetails"
              class="px-4 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80"
            >
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal confirmation suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showDeleteModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer <span class="font-medium">"{{ fileToDelete?.name }}"</span> ?
          Cette action est irréversible.
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button 
            @click="deleteFile"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// État
const viewMode = ref('grid')
const searchQuery = ref('')
const filterType = ref('all')
const sortBy = ref('date-desc')
const showUploadModal = ref(false)
const showFileModal = ref(false)
const showDeleteModal = ref(false)
const fileInput = ref(null)
const selectedFiles = ref([])
const selectedFile = ref(null)
const fileToDelete = ref(null)

// Données simulées
const media = ref([
  {
    id: 1,
    name: 'joueur-service.jpg',
    type: 'image',
    size: '1.2 MB',
    date: '2024-01-15',
    url: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?w=400&q=80',
    usedIn: 2
  },
  {
    id: 2,
    name: 'court-tennis.mp4',
    type: 'video',
    size: '8.5 MB',
    date: '2024-01-14',
    url: 'https://example.com/video.mp4',
    usedIn: 1,
    preview: false
  },
  {
    id: 3,
    name: 'programme-junior.pdf',
    type: 'document',
    size: '450 KB',
    date: '2024-01-13',
    url: '/documents/programme.pdf',
    usedIn: 0
  },
  {
    id: 4,
    name: 'entrainement-revers.jpg',
    type: 'image',
    size: '2.1 MB',
    date: '2024-01-12',
    url: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=400&q=80',
    usedIn: 3
  },
  {
    id: 5,
    name: 'tournoi-finale.mp4',
    type: 'video',
    size: '15.2 MB',
    date: '2024-01-11',
    url: 'https://example.com/tournoi.mp4',
    usedIn: 1,
    preview: false
  },
  {
    id: 6,
    name: 'reglement-interieur.docx',
    type: 'document',
    size: '320 KB',
    date: '2024-01-10',
    url: '/documents/reglement.docx',
    usedIn: 0
  }
])

// Statistiques
const imagesCount = computed(() => media.value.filter(m => m.type === 'image').length)
const videosCount = computed(() => media.value.filter(m => m.type === 'video').length)
const documentsCount = computed(() => media.value.filter(m => m.type === 'document').length)

// Filtrage et recherche
const filteredMedia = computed(() => {
  let filtered = [...media.value]
  
  // Filtre par type
  if (filterType.value !== 'all') {
    filtered = filtered.filter(m => m.type === filterType.value)
  }
  
  // Recherche textuelle
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(m => m.name.toLowerCase().includes(query))
  }
  
  // Tri
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'date-desc':
        return new Date(b.date) - new Date(a.date)
      case 'date-asc':
        return new Date(a.date) - new Date(b.date)
      case 'name-asc':
        return a.name.localeCompare(b.name)
      case 'name-desc':
        return b.name.localeCompare(a.name)
      default:
        return 0
    }
  })
  
  return filtered
})

// Icône selon type de fichier
const getFileIcon = (type) => {
  const icons = {
    image: 'heroicons:photo',
    video: 'heroicons:video-camera',
    document: 'heroicons:document-text'
  }
  return icons[type] || 'heroicons:document'
}

// Upload
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  selectedFiles.value = files
}

const handleDrop = (event) => {
  const files = Array.from(event.dataTransfer.files)
  selectedFiles.value = files
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const uploadFiles = () => {
  // Simuler l'upload
  selectedFiles.value.forEach(file => {
    const newFile = {
      id: Date.now() + Math.random(),
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      size: formatFileSize(file.size),
      date: new Date().toISOString().split('T')[0],
      url: URL.createObjectURL(file),
      usedIn: 0
    }
    media.value.push(newFile)
  })
  
  showUploadModal.value = false
  selectedFiles.value = []
  fileInput.value.value = ''
}

// Actions sur les fichiers
const openFileDetails = (file) => {
  selectedFile.value = { ...file }
  showFileModal.value = true
}

const viewFile = (file) => {
  if (file.type === 'image' || file.type === 'video') {
    window.open(file.url, '_blank')
  } else {
    // Télécharger le document
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.click()
  }
}

const editFile = (file) => {
  selectedFile.value = { ...file }
  showFileModal.value = true
}

const saveFileDetails = () => {
  const index = media.value.findIndex(m => m.id === selectedFile.value.id)
  if (index !== -1) {
    media.value[index] = { ...selectedFile.value }
  }
  showFileModal.value = false
}

const confirmDelete = (file) => {
  fileToDelete.value = file
  showDeleteModal.value = true
}

const deleteFile = () => {
  media.value = media.value.filter(m => m.id !== fileToDelete.value.id)
  showDeleteModal.value = false
  fileToDelete.value = null
}
definePageMeta({
  layout: 'dashboard' 
})
</script>