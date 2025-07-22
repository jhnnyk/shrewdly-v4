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

    <div v-if="uploadsStore.isProcessing">
      <span class="material-symbols-outlined progress-spin">progress_activity</span>
    </div>

    <div v-if="uploadsStore.uploadedImageUrl">
      <p>image uploaded and resized!</p>
      <img :src="uploadsStore.uploadedImageUrl" alt="uploaded image" />
    </div>
  </div>
</template>

<style>
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.progress-spin {
  animation-name: spin;
  animation-duration: 2000ms; /* Adjust duration as needed */
  animation-iteration-count: infinite; /* Keeps it spinning continuously */
  animation-timing-function: linear; /* Smooth, even spin */
}
</style>
