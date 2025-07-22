<script setup>
import { ref } from 'vue'
import { useUploadsStore } from '@/stores/UploadsStore'

const uploadsStore = useUploadsStore()
const selectedFile = ref(null)

const handleFileSelect = (event) => {
  selectedFile.value = event.target.files[0]
}

const uploadImage = () => {
  if (selectedFile.value) {
    uploadsStore.uploadImage(selectedFile.value)
  }
}
</script>

<template>
  <div>
    <input type="file" @change="handleFileSelect" accept="image/*" />
    <button @click="uploadImage" :disabled="!selectedFile || uploadsStore.isUploading">
      upload
    </button>

    <div v-if="uploadsStore.isUploading">
      uploading: {{ uploadsStore.uploadProgress.toFixed(2) }}%
    </div>

    <div v-if="uploadsStore.uploadError">error: {{ uploadsStore.uploadError.message }}</div>

    <div v-if="uploadsStore.uploadedImageUrl">
      <p>image uploaded and resized!</p>
      <img :src="uploadsStore.uploadedImageUrl" alt="uploaded image" />
    </div>
  </div>
</template>
