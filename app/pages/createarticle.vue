<template>
  <div class="min-h-screen bg-gray-50" style="font-family: 'Syne', sans-serif;">

    <!-- ══════════════════════════════════
         MODALES PERSONNALISÉES
    ══════════════════════════════════ -->

    <!-- Modale d'erreur -->
    <Transition name="modal">
      <div v-if="modal.show && modal.type === 'error'" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" @click="modal.show = false"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
              </svg>
            </div>
            <h3 class="text-base font-extrabold text-gray-900">{{ modal.title }}</h3>
          </div>
          <p class="text-sm text-gray-600 mb-5 ml-13">{{ modal.message }}</p>
          <div class="flex justify-end">
            <button
              type="button"
              @click="modal.show = false"
              class="px-5 py-2 text-sm font-bold rounded-xl text-white transition-all hover:opacity-90 active:scale-95"
              style="background-color: #1a1a1a;"
            >OK</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Modale de succès -->
    <Transition name="modal">
      <div v-if="modal.show && modal.type === 'success'" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
        <div class="relative bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style="background-color: #edffc0;">
              <svg class="w-5 h-5" style="color: #5a8a00;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" d="M5 13l4 4L19 7"/>
              </svg>
            </div>
            <h3 class="text-base font-extrabold text-gray-900">{{ modal.title }}</h3>
          </div>
          <p class="text-sm text-gray-600 mb-5">{{ modal.message }}</p>
          <div class="flex justify-end">
            <button
              type="button"
              @click="handleSuccessClose"
              class="px-5 py-2 text-sm font-bold rounded-xl transition-all hover:opacity-90 active:scale-95"
              style="background-color: #A8F000; color: #1a1a1a;"
            >Continuer</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- HEADER -->
    <header class="top-0 z-40 bg-white border-b border-gray-200 px-4 sm:px-8 py-4">
      <div class="max-w-7xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-4">
          <div class="w-px h-5 bg-gray-300"></div>
          <h1 class="text-xl font-extrabold text-gray-900">
            {{ isEditMode ? "Modifier l'article" : 'Nouvel article' }}
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <button
            @click="saveArticle"
            :disabled="saving"
            class="px-6 py-2 text-sm font-bold rounded-xl transition-all duration-200 hover:opacity-90 active:scale-95 disabled:opacity-50"
            style="background-color: #A8F000; color: #1a1a1a;"
          >
            {{ saving ? 'Publication...' : 'Publier' }}
          </button>
        </div>
      </div>
    </header>

    <!-- CONTENU PRINCIPAL -->
    <div class="max-w-7xl mx-auto px-4 sm:px-8 py-6 sm:py-8 flex flex-col md:flex-row md:gap-8 gap-6">

      <!-- Colonne gauche : éditeur -->
      <div class="flex-1 min-w-0 flex flex-col gap-6 order-1">

        <!-- Titre -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Titre de l'article *</label>
          <input
            v-model="article.title"
            type="text"
            placeholder="Titre de l'article"
            class="w-full px-4 py-3 text-lg font-bold border border-gray-200 rounded-xl outline-none transition-colors duration-150"
            @focus="e => e.target.style.borderColor = '#A8F000'"
            @blur="e => e.target.style.borderColor = '#e5e7eb'"
          />
        </div>

        <!-- Éditeur Tiptap -->
        <div>
          <label class="block text-sm font-bold text-gray-700 mb-2">Contenu *</label>
          <div class="bg-white border border-gray-200 rounded-xl overflow-hidden">

            <!-- Toolbar -->
            <div v-if="editor" class="flex items-center gap-1 px-3 py-2 border-b border-gray-100 bg-gray-50 flex-wrap">

              <select
                @change="e => {
                  const val = e.target.value
                  if (val === 'paragraph') editor.chain().focus().setParagraph().run()
                  else editor.chain().focus().toggleHeading({ level: parseInt(val) }).run()
                  e.target.value = ''
                }"
                class="text-xs px-2 py-1 border border-gray-300 rounded bg-white cursor-pointer"
              >
                <option value="">Style</option>
                <option value="paragraph">Paragraphe</option>
                <option value="1">Titre 1</option>
                <option value="2">Titre 2</option>
                <option value="3">Titre 3</option>
              </select>

              <div class="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" @click="editor.chain().focus().toggleBold().run()" :class="{ 'bg-gray-300': editor.isActive('bold') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Gras">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6zM6 12h9a4 4 0 014 4 4 4 0 01-4 4H6z"/></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleItalic().run()" :class="{ 'bg-gray-300': editor.isActive('italic') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Italique">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'bg-gray-300': editor.isActive('underline') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Souligné">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" d="M6 3v7a6 6 0 0012 0V3M4 21h16"/></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'bg-gray-300': editor.isActive('strike') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Barré">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 12h18M7 5h10M9 19h6"/></svg>
              </button>

              <div class="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'bg-gray-300': editor.isActive('bulletList') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Liste à puces">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="9" y1="6" x2="20" y2="6"/><line x1="9" y1="12" x2="20" y2="12"/><line x1="9" y1="18" x2="20" y2="18"/><circle cx="5" cy="6" r="1"/><circle cx="5" cy="12" r="1"/><circle cx="5" cy="18" r="1"/></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'bg-gray-300': editor.isActive('orderedList') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Liste numérotée">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-1-1.5S4 14 4 15"/></svg>
              </button>

              <button type="button" @click="editor.chain().focus().toggleBlockquote().run()" :class="{ 'bg-gray-300': editor.isActive('blockquote') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Citation">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zM15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>
              </button>

              <div class="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" @click="editor.chain().focus().toggleCodeBlock().run()" :class="{ 'bg-gray-300': editor.isActive('codeBlock') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Bloc de code">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M8 9l-4 3 4 3M16 9l4 3-4 3M12 3l-2 18"/></svg>
              </button>

              <button type="button" @click="editor.chain().focus().setHorizontalRule().run()" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Ligne horizontale">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><line x1="3" y1="12" x2="21" y2="12"/></svg>
              </button>

              <div class="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" @click="addLink" :class="{ 'bg-gray-300': editor.isActive('link') }" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Ajouter un lien">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>
              </button>

              <button type="button" @click="editorImageInput.click()" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150" title="Insérer une image">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path stroke-linecap="round" d="M21 15l-5-5L5 21"/></svg>
              </button>

              <input ref="editorImageInput" type="file" accept="image/*" class="hidden" @change="handleEditorImageUpload" />

              <div class="w-px h-6 bg-gray-300 mx-1"></div>

              <button type="button" @click="editor.chain().focus().undo().run()" :disabled="!editor.can().undo()" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150 disabled:opacity-30" title="Annuler">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M3 7v6h6M21 17v-6h-6"/><path stroke-linecap="round" d="M21 3a9 9 0 00-9 9M3 21a9 9 0 009-9"/></svg>
              </button>

              <button type="button" @click="editor.chain().focus().redo().run()" :disabled="!editor.can().redo()" class="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors duration-150 disabled:opacity-30" title="Refaire">
                <svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" d="M21 7v6h-6M3 17v-6h6"/><path stroke-linecap="round" d="M3 3a9 9 0 019 9M21 21a9 9 0 01-9-9"/></svg>
              </button>
            </div>

            <!-- Zone d'édition Tiptap -->
            <EditorContent :editor="editor" class="tiptap-editor min-h-[300px] sm:min-h-[400px]" />
          </div>

          <p class="text-xs text-gray-400 mt-2">
            Raccourcis :
            <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+B</kbd> gras,
            <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+I</kbd> italique,
            <kbd class="px-1.5 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+S</kbd> sauvegarder
          </p>
        </div>

      </div>

      <!-- Colonne droite : métadonnées -->
      <div class="w-full md:w-80 shrink-0 flex flex-col gap-6 order-2">

        <!-- Image à la une -->
        <div class="bg-white rounded-xl p-5 border border-gray-200">
          <h3 class="text-sm font-extrabold text-gray-900 mb-3">Image à la une</h3>
          <div
            v-if="!article.featuredImage"
            @click="featuredImageInput.click()"
            class="w-full h-40 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-[#A8F000] transition-colors duration-200"
          >
            <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            <p class="text-xs text-gray-500 font-medium">Cliquez pour ajouter une image</p>
          </div>
          <div v-else class="relative group">
            <img :src="article.featuredImage" alt="Featured" class="w-full h-40 object-cover rounded-xl" />
            <button
              type="button"
              @click="article.featuredImage = null"
              class="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-150"
            >✕</button>
          </div>
          <input ref="featuredImageInput" type="file" accept="image/*" class="hidden" @change="handleFeaturedImageUpload" />
        </div>

        <!-- Tags -->
        <div class="bg-white rounded-xl p-5 border border-gray-200">
          <h3 class="text-sm font-extrabold text-gray-900 mb-3">Tags</h3>
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-for="(tag, index) in article.tags"
              :key="index"
              class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
              style="background-color: #A8F000; color: #1a1a1a;"
            >
              {{ tag }}
              <button type="button" @click="article.tags.splice(index, 1)" class="hover:opacity-70">✕</button>
            </span>
          </div>
          <div class="flex gap-2">
            <input
              v-model="newTag"
              @keypress.enter.prevent="addTag"
              type="text"
              placeholder="Ajouter un tag..."
              class="flex-1 px-3 py-1.5 w-full text-sm border border-gray-200 rounded-lg outline-none"
              @focus="e => e.target.style.borderColor = '#A8F000'"
              @blur="e => e.target.style.borderColor = '#e5e7eb'"
            />
            <button
              type="button"
              @click="addTag"
              class="px-3 py-1.5 text-xs font-bold rounded-lg"
              style="background-color: #1a1a1a; color: white;"
            >+</button>
          </div>
        </div>

        <!-- Auteur -->
        <div class="bg-white rounded-xl p-5 border border-gray-200">
          <h3 class="text-sm font-extrabold text-gray-900 mb-3">Auteur</h3>
          <div class="flex items-center gap-3 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
            <div class="w-8 h-8 rounded-full bg-[#A8F000] flex items-center justify-center text-black font-bold text-sm">H</div>
            <div>
              <p class="text-sm font-medium text-gray-900">Jean-Hugues GODONOU</p>
              <p class="text-xs text-gray-500">Auteur principal</p>
            </div>
          </div>
          <input type="hidden" v-model="article.author" />
        </div>

        <!-- Date de publication -->
        <div class="bg-white rounded-xl p-5 border border-gray-200">
          <h3 class="text-sm font-extrabold text-gray-900 mb-3">Date de publication</h3>
          <div class="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-700 font-medium">
            {{ formattedPublishDate }}
          </div>
          <input type="hidden" name="publishDate" :value="isoPublishDate" />
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import Placeholder from '@tiptap/extension-placeholder'





definePageMeta({
  layout: 'dashboard'
})

// ── Système de modale ──
const modal = ref({
  show: false,
  type: 'error', // 'error' | 'success'
  title: '',
  message: '',
  redirectAfter: null,
})

const showError = (title, message) => {
  modal.value = { show: true, type: 'error', title, message, redirectAfter: null }
}

const showSuccess = (title, message, redirectAfter = null) => {
  modal.value = { show: true, type: 'success', title, message, redirectAfter }
}

const handleSuccessClose = () => {
  const redirect = modal.value.redirectAfter
  modal.value.show = false
  if (redirect) navigateTo(redirect)
}

// ── Date ──
const formattedPublishDate = computed(() => {
  return new Date().toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
})

const isoPublishDate = computed(() => new Date().toISOString())

// ── Mode édition ──
const route = useRoute()
const isEditMode = ref(!!route.params.id)
const saving = ref(false)

// ── Données article ──
const article = ref({
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  featuredImage: null,
  category: '',
  tags: [],
  author: 'HUGUO',
  status: 'draft',
  publishDate: '',
  metaTitle: '',
  metaDescription: '',
})

// ── Tiptap Editor ──
const editor = useEditor({
  extensions: [
    StarterKit,
    Underline,
    Link.configure({
      openOnClick: false,
      HTMLAttributes: { class: 'text-[#A8F000] underline cursor-pointer' },
    }),
    Image.configure({
      HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' },
    }),
    Placeholder.configure({
      placeholder: 'Commencez à écrire votre article...',
    }),
  ],
  content: article.value.content,
  editorProps: {
    attributes: {
      class: 'prose prose-sm max-w-none px-4 py-4 min-h-[300px] sm:min-h-[400px] outline-none',
    },
  },
  onUpdate: ({ editor }) => {
    article.value.content = editor.getHTML()
  },
})

// ── Refs inputs file ──
const featuredImageInput = ref(null)
const editorImageInput = ref(null)

// ── Fonctions éditeur ──
const addLink = () => {
  const url = prompt('URL du lien :')
  if (url) editor.value.chain().focus().setLink({ href: url }).run()
}

// APRÈS ✅ — uploade sur R2 puis insère l'URL
const handleEditorImageUpload = async (e) => {
  const file = e.target.files[0]
  if (!file) return

  try {
    // Crée un FormData pour envoyer le fichier
    const formData = new FormData()
    formData.append('file', file)

    // Appelle une API qui upload sur R2 et retourne l'URL
    const response = await $fetch('/api/upload-image', {
      method: 'POST',
      body: formData
    })

    // Insère l'URL dans l'éditeur
    editor.value.chain().focus().setImage({ src: response.url }).run()
  } catch (err) {
    showError('Erreur upload', "Impossible d'uploader l'image.")
  }

  e.target.value = ''
}

const handleFeaturedImageUpload = (e) => {
  const file = e.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (ev) => {
      article.value.featuredImage = ev.target.result
    }
    reader.readAsDataURL(file)
  }
}

// ── Tags ──
const newTag = ref('')
const addTag = () => {
  const trimmed = newTag.value.trim()
  if (trimmed && !article.value.tags.includes(trimmed)) {
    article.value.tags.push(trimmed)
    newTag.value = ''
  }
}

// ── Sauvegarder ──
const saveArticle = async () => {
  if (!article.value.title?.trim()) {
    showError('Titre manquant', "Le titre de l'article est obligatoire.")
    return
  }
  if (!article.value.content?.trim()) {
    showError('Contenu manquant', "Le contenu de l'article est obligatoire.")
    return
  }
  if (!article.value.featuredImage) {
    showError('Image manquante', "Veuillez ajouter une image à la une avant de publier.")
    return
  }

  saving.value = true

  try {
    const payload = {
      title: article.value.title.trim(),
      content: article.value.content,
      excerpt: article.value.excerpt || article.value.content.replace(/<[^>]+>/g, '').substring(0, 160) + '...',
      featuredImage: article.value.featuredImage,
      category: article.value.category || null,
      tags: article.value.tags,
      author: 'Jean-Hugues GODONOU',
      status: 'published',
      publishDate: new Date().toISOString(),
      metaTitle: article.value.metaTitle || article.value.title,
      metaDescription: article.value.metaDescription || (article.value.excerpt || '').substring(0, 160),
    }


    const response = await $fetch('/api/articles', {
      method: 'POST',
      body: payload,
      headers: { 'Content-Type': 'application/json' }
    })


    console.log('Réponse API :', response)
    showSuccess('Article publié !', 'Votre article a été publié avec succès.', '/createarticle')

  } catch (err) {
    console.error('Erreur publication :', err)
    if (err.status === 400) {
      showError('Données invalides', err.data?.message || "Vérifie le titre, le contenu et l'image.")
    } else {
      showError('Erreur serveur', "Une erreur inattendue s'est produite. Vérifie la console.")
    }
  } finally {
    saving.value = false
  }
}

// ── Auto-slug ──
watch(() => article.value.title, (newTitle) => {
  if (!isEditMode.value && newTitle) {
    article.value.slug = newTitle
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }
})

// ── Raccourcis clavier ──
onMounted(() => {
  const handleKeydown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      saveArticle()
    }
  }
  document.addEventListener('keydown', handleKeydown)

  onBeforeUnmount(() => {
    document.removeEventListener('keydown', handleKeydown)
    if (editor.value) editor.value.destroy()
  })
})

useHead({
  title: isEditMode.value ? "Modifier l'article" : 'Nouvel article',
  meta: [{ name: 'robots', content: 'noindex' }]
})
</script>

<style>
/* Transitions modale */
.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }
.modal-enter-from,
.modal-leave-to { opacity: 0; }

/* Tiptap */
.tiptap-editor { min-height: 300px; }
@media (min-width: 640px) {
  .tiptap-editor { min-height: 400px; }
}
.tiptap-editor .ProseMirror { outline: none; }
.tiptap-editor .ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  color: #9ca3af;
  pointer-events: none;
  height: 0;
  float: left;
}

.prose { color: #374151; line-height: 1.75; }
.prose h1 { font-size: 1.875rem; font-weight: 800; margin-top: 1.5rem; margin-bottom: 0.75rem; color: #1a1a1a; }
.prose h2 { font-size: 1.5rem; font-weight: 700; margin-top: 1.25rem; margin-bottom: 0.5rem; color: #1a1a1a; }
.prose h3 { font-size: 1.25rem; font-weight: 700; margin-top: 1rem; margin-bottom: 0.5rem; color: #1a1a1a; }
.prose p { margin-bottom: 1rem; }
.prose ul, .prose ol { margin: 1rem 0; padding-left: 1.5rem; }
.prose li { margin-bottom: 0.5rem; }
.prose blockquote { border-left: 4px solid #A8F000; padding-left: 1rem; margin: 1.5rem 0; font-style: italic; color: #4b5563; }
.prose pre { background: #1a1a1a; color: #A8F000; padding: 1rem; border-radius: 0.5rem; overflow-x: auto; margin: 1rem 0; }
.prose code { background: #f3f4f6; padding: 0.2rem 0.4rem; border-radius: 0.25rem; font-size: 0.875em; color: #1a1a1a; }
.prose pre code { background: transparent; padding: 0; color: #A8F000; }
.prose hr { border: none; border-top: 2px solid #e5e7eb; margin: 2rem 0; }
.prose strong { font-weight: 700; color: #1a1a1a; }
.prose em { font-style: italic; }
.prose img { border-radius: 0.75rem; max-width: 100%; height: auto; margin: 1.5rem 0; }
</style>