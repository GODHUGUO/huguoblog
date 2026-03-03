<template>
  <div class="p-6">
    <!-- En-tête -->
    <div class="flex items-center justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Gestion des utilisateurs</h1>
      
      <!-- Bouton Ajouter -->
      <button 
        @click="openAddUserModal"
        class="flex items-center gap-2 px-4 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
      >
        <Icon name="heroicons:plus" class="w-5 h-5" />
        Ajouter un utilisateur
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
              placeholder="Rechercher un utilisateur..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
            <Icon name="heroicons:magnifying-glass" class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>
        </div>

        <!-- Filtre par rôle -->
        <select 
          v-model="roleFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
        >
          <option value="all">Tous les rôles</option>
          <option value="admin">Administrateurs</option>
          <option value="editor">Éditeurs</option>
          <option value="contributor">Contributeurs</option>
        </select>

        <!-- Filtre par statut -->
        <select 
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
        >
          <option value="all">Tous les statuts</option>
          <option value="active">Actifs</option>
          <option value="inactive">Inactifs</option>
        </select>
      </div>
    </div>

    <!-- Statistiques rapides -->
    <div class="grid grid-cols-4 gap-4 mb-6">
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Total</p>
        <p class="text-2xl font-bold">{{ users.length }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Administrateurs</p>
        <p class="text-2xl font-bold">{{ roleCounts.admin }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Éditeurs</p>
        <p class="text-2xl font-bold">{{ roleCounts.editor }}</p>
      </div>
      <div class="bg-white rounded-lg shadow-sm p-4">
        <p class="text-sm text-gray-600">Contributeurs</p>
        <p class="text-2xl font-bold">{{ roleCounts.contributor }}</p>
      </div>
    </div>

    <!-- Tableau des utilisateurs -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <table class="w-full">
        <thead class="bg-gray-50 border-b border-gray-200">
          <tr class="text-left text-sm text-gray-600">
            <th class="px-6 py-3">Utilisateur</th>
            <th class="px-6 py-3">Rôle</th>
            <th class="px-6 py-3">Dernière connexion</th>
            <th class="px-6 py-3">Statut</th>
            <th class="px-6 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.id"
            class="border-b last:border-0 hover:bg-gray-50 transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <!-- Avatar -->
                <div class="w-10 h-10 rounded-full bg-[#A8F000] bg-opacity-20 flex items-center justify-center text-[#A8F000] font-bold">
                  {{ user.initials }}
                </div>
                <div>
                  <p class="font-medium">{{ user.name }}</p>
                  <p class="text-sm text-gray-500">{{ user.email }}</p>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="{
                  'bg-purple-100 text-purple-800': user.role === 'admin',
                  'bg-blue-100 text-blue-800': user.role === 'editor',
                  'bg-green-100 text-green-800': user.role === 'contributor'
                }"
              >
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td class="px-6 py-4 text-sm text-gray-600">
              <div>{{ user.lastLogin.date }}</div>
              <div class="text-xs text-gray-400">{{ user.lastLogin.time }}</div>
            </td>
            <td class="px-6 py-4">
              <span 
                class="px-3 py-1 rounded-full text-xs font-medium"
                :class="user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'"
              >
                {{ user.status === 'active' ? 'Actif' : 'Inactif' }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <button 
                  @click="openEditUser(user)"
                  class="p-2 hover:bg-blue-50 rounded-full transition-colors"
                  title="Modifier"
                >
                  <Icon name="heroicons:pencil-square" class="w-5 h-5 text-blue-600" />
                </button>
                <button 
                  @click="openResetPassword(user)"
                  class="p-2 hover:bg-yellow-50 rounded-full transition-colors"
                  title="Réinitialiser mot de passe"
                >
                  <Icon name="heroicons:key" class="w-5 h-5 text-yellow-600" />
                </button>
                <button 
                  v-if="user.role !== 'admin'"
                  @click="confirmDelete(user)"
                  class="p-2 hover:bg-red-50 rounded-full transition-colors"
                  title="Supprimer"
                >
                  <Icon name="heroicons:trash" class="w-5 h-5 text-red-600" />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200">
        <p class="text-sm text-gray-600">
          Affichage de {{ startIndex }} à {{ endIndex }} sur {{ filteredUsers.length }} utilisateurs
        </p>
        <div class="flex gap-2">
          <button 
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Précédent
          </button>
          <span class="px-3 py-1">{{ currentPage }} / {{ totalPages }}</span>
          <button 
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
          >
            Suivant
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Ajouter/Modifier utilisateur -->
    <div v-if="showUserModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showUserModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
          {{ editingUser ? 'Modifier l\'utilisateur' : 'Ajouter un utilisateur' }}
        </h3>
        
        <form @submit.prevent="saveUser" class="space-y-4">
          <!-- Nom -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
            <input 
              v-model="userForm.name" 
              type="text" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
              placeholder="Jean Dupont"
            >
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Email *</label>
            <input 
              v-model="userForm.email" 
              type="email" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
              placeholder="jean@tennis.com"
            >
          </div>

          <!-- Rôle -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Rôle *</label>
            <select 
              v-model="userForm.role" 
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
              <option value="contributor">Contributeur</option>
              <option value="editor">Éditeur</option>
              <option value="admin">Administrateur</option>
            </select>
          </div>

          <!-- Statut -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Statut</label>
            <select 
              v-model="userForm.status"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
            >
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>

          <!-- Mot de passe (uniquement pour ajout) -->
          <div v-if="!editingUser">
            <label class="block text-sm font-medium text-gray-700 mb-2">Mot de passe temporaire *</label>
            <div class="flex gap-2">
              <input 
                v-model="userForm.password" 
                type="text" 
                required
                class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#A8F000] focus:border-transparent outline-none"
                placeholder="Mot de passe"
              >
              <button 
                type="button"
                @click="generatePassword"
                class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                title="Générer un mot de passe"
              >
                <Icon name="heroicons:arrow-path" class="w-5 h-5" />
              </button>
            </div>
            <p class="text-xs text-gray-500 mt-1">L'utilisateur pourra le changer à sa première connexion</p>
          </div>

          <!-- Actions -->
          <div class="flex justify-end gap-3 pt-4">
            <button 
              type="button"
              @click="showUserModal = false"
              class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Annuler
            </button>
            <button 
              type="submit"
              class="px-6 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
            >
              {{ editingUser ? 'Mettre à jour' : 'Ajouter' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- MODAL: Réinitialisation mot de passe -->
    <div v-if="showPasswordModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showPasswordModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Réinitialiser le mot de passe</h3>
        
        <p class="text-gray-600 mb-4">
          Générer un nouveau mot de passe pour <span class="font-medium">{{ resetPasswordUser?.name }}</span>
        </p>
        
        <div class="flex gap-2 mb-4">
          <input 
            v-model="newPassword" 
            type="text" 
            readonly
            class="flex-1 px-4 py-2 bg-gray-50 border border-gray-300 rounded-lg"
          >
          <button 
            @click="generateNewPassword"
            class="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            title="Générer un nouveau mot de passe"
          >
            <Icon name="heroicons:arrow-path" class="w-5 h-5" />
          </button>
        </div>
        
        <p class="text-xs text-gray-500 mb-4">
          Copiez ce mot de passe et transmettez-le à l'utilisateur.
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="showPasswordModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Fermer
          </button>
          <button 
            @click="copyPassword"
            class="px-6 py-2 bg-[#A8F000] text-[#1a1a1a] rounded-lg font-medium hover:bg-opacity-80 transition-colors"
          >
            Copier le mot de passe
          </button>
        </div>
      </div>
    </div>

    <!-- MODAL: Confirmation suppression -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black bg-opacity-50" @click="showDeleteModal = false"></div>
      
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full p-6 relative z-10">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">Confirmer la suppression</h3>
        <p class="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer l'utilisateur <span class="font-medium">{{ userToDelete?.name }}</span> ?
          Cette action est irréversible.
        </p>
        
        <div class="flex justify-end gap-3">
          <button 
            @click="showDeleteModal = false"
            class="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button 
            @click="deleteUser"
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de notification -->
    <div v-if="showToast" class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg animate-fade-in-up"
         :class="toastType === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'">
      {{ toastMessage }}
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'

definePageMeta({
  layout: 'dashboard' 
})

// État
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const currentPage = ref(1)
const usersPerPage = 10

// Modaux
const showUserModal = ref(false)
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)
const editingUser = ref(null)
const resetPasswordUser = ref(null)
const userToDelete = ref(null)
const newPassword = ref('')

// Toast
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success')

// Formulaire utilisateur
const userForm = reactive({
  name: '',
  email: '',
  role: 'contributor',
  status: 'active',
  password: ''
})

// Données statiques des utilisateurs
const users = ref([
  {
    id: 1,
    name: 'Thomas Admin',
    email: 'thomas@tennis.com',
    initials: 'TA',
    role: 'admin',
    status: 'active',
    lastLogin: {
      date: '15/01/2025',
      time: '09:30'
    }
  },
  {
    id: 2,
    name: 'Sophie Martin',
    email: 'sophie@tennis.com',
    initials: 'SM',
    role: 'editor',
    status: 'active',
    lastLogin: {
      date: '14/01/2025',
      time: '14:20'
    }
  },
  {
    id: 3,
    name: 'Marc Dubois',
    email: 'marc@tennis.com',
    initials: 'MD',
    role: 'contributor',
    status: 'active',
    lastLogin: {
      date: '12/01/2025',
      time: '11:15'
    }
  },
  {
    id: 4,
    name: 'Julie Leroy',
    email: 'julie@tennis.com',
    initials: 'JL',
    role: 'editor',
    status: 'active',
    lastLogin: {
      date: '13/01/2025',
      time: '16:45'
    }
  },
  {
    id: 5,
    name: 'Pierre Durand',
    email: 'pierre@tennis.com',
    initials: 'PD',
    role: 'contributor',
    status: 'inactive',
    lastLogin: {
      date: '05/01/2025',
      time: '10:00'
    }
  },
  {
    id: 6,
    name: 'Claire Fontaine',
    email: 'claire@tennis.com',
    initials: 'CF',
    role: 'contributor',
    status: 'active',
    lastLogin: {
      date: '15/01/2025',
      time: '08:15'
    }
  },
  {
    id: 7,
    name: 'Lucas Petit',
    email: 'lucas@tennis.com',
    initials: 'LP',
    role: 'editor',
    status: 'active',
    lastLogin: {
      date: '14/01/2025',
      time: '09:45'
    }
  }
])

// Libellés des rôles
const getRoleLabel = (role) => {
  const labels = {
    admin: 'Administrateur',
    editor: 'Éditeur',
    contributor: 'Contributeur'
  }
  return labels[role] || role
}

// Compteurs par rôle
const roleCounts = computed(() => {
  const counts = { admin: 0, editor: 0, contributor: 0 }
  filteredUsers.value.forEach(user => {
    if (counts[user.role] !== undefined) counts[user.role]++
  })
  return counts
})

// Filtrage des utilisateurs
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    // Filtre recherche
    const matchesSearch = searchQuery.value === '' || 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    
    // Filtre rôle
    const matchesRole = roleFilter.value === 'all' || user.role === roleFilter.value
    
    // Filtre statut
    const matchesStatus = statusFilter.value === 'all' || user.status === statusFilter.value
    
    return matchesSearch && matchesRole && matchesStatus
  })
})

// Pagination
const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage))
const startIndex = computed(() => (currentPage.value - 1) * usersPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * usersPerPage, filteredUsers.value.length))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return filteredUsers.value.slice(start, end)
})

// Réinitialiser la pagination quand les filtres changent
watch([searchQuery, roleFilter, statusFilter], () => {
  currentPage.value = 1
})

// Générer un mot de passe aléatoire
const generateRandomPassword = () => {
  const length = 12
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  return password
}

// Générer un mot de passe pour le formulaire
const generatePassword = () => {
  userForm.password = generateRandomPassword()
}

// Générer un nouveau mot de passe pour réinitialisation
const generateNewPassword = () => {
  newPassword.value = generateRandomPassword()
}

// Ouvrir modal d'ajout
const openAddUserModal = () => {
  editingUser.value = null
  Object.assign(userForm, {
    name: '',
    email: '',
    role: 'contributor',
    status: 'active',
    password: generateRandomPassword()
  })
  showUserModal.value = true
}

// Ouvrir modal de modification
const openEditUser = (user) => {
  editingUser.value = user
  Object.assign(userForm, {
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
    password: ''
  })
  showUserModal.value = true
}

// Sauvegarder utilisateur
const saveUser = () => {
  if (editingUser.value) {
    // Modification
    const index = users.value.findIndex(u => u.id === editingUser.value.id)
    if (index !== -1) {
      users.value[index] = {
        ...users.value[index],
        name: userForm.name,
        email: userForm.email,
        role: userForm.role,
        status: userForm.status,
        initials: userForm.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      }
    }
    showToastMessage('Utilisateur modifié avec succès')
  } else {
    // Ajout
    const newUser = {
      id: users.value.length + 1,
      name: userForm.name,
      email: userForm.email,
      role: userForm.role,
      status: userForm.status,
      initials: userForm.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2),
      lastLogin: {
        date: 'Jamais',
        time: ''
      }
    }
    users.value.push(newUser)
    showToastMessage('Utilisateur ajouté avec succès')
  }
  
  showUserModal.value = false
}

// Ouvrir modal de réinitialisation mot de passe
const openResetPassword = (user) => {
  resetPasswordUser.value = user
  newPassword.value = generateRandomPassword()
  showPasswordModal.value = true
}

// Copier le mot de passe
const copyPassword = async () => {
  try {
    await navigator.clipboard.writeText(newPassword.value)
    showToastMessage('Mot de passe copié dans le presse-papier')
    showPasswordModal.value = false
  } catch (err) {
    showToastMessage('Erreur lors de la copie', 'error')
  }
}

// Confirmer suppression
const confirmDelete = (user) => {
  userToDelete.value = user
  showDeleteModal.value = true
}

// Supprimer utilisateur
const deleteUser = () => {
  users.value = users.value.filter(u => u.id !== userToDelete.value.id)
  showDeleteModal.value = false
  userToDelete.value = null
  showToastMessage('Utilisateur supprimé avec succès')
}

// Toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message
  toastType.value = type
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out;
}
</style>