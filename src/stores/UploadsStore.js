import { defineStore } from 'pinia'
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '@/firebase'

export const useUploadsStore = defineStore('UploadsStore', {
  state: () => ({
    uploadProgress: 0,
    uploadError: null,
    uploadedImageUrl: null,
    isUploading: false,
  }),

  actions: {
    async uploadImage(file) {
      this.isUploading = true
      this.uploadProgress = 0
      this.uploadError = null
      this.uploadedImageUrl = null

      const filePath = `images/original/${file.name}` // original image path
      const fileRef = storageRef(storage, filePath)
      const uploadTask = uploadBytesResumable(fileRef, file)

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          this.uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        },
        (error) => {
          this.uploadError = error
          this.isUploading = false
        },
        async () => {
          console.log(file)

          // Upload complete to original path
          // Firebase Extension will now process and create resized images
          // You might need to listen for changes in the resized image path
          // or assume a consistent naming convention for resized images

          // For simplicity, let's assume the resized image will be named similar to the original,
          // or you might have a mechanism to fetch the resized URL from Firestore
          const lastDotIndex = file.name.lastIndexOf('.')
          const baseName = file.name.substring(0, lastDotIndex)
          const resizedFilePath = `images/original/resized/${baseName}_200x200.jpeg` // Example resized path
          const resizedFileRef = storageRef(storage, resizedFilePath)

          try {
            const url = await getDownloadURL(resizedFileRef)
            this.uploadedImageUrl = url
            console.log('uploaded image URL: ', url)
          } catch (error) {
            this.uploadError = error
          } finally {
            this.isUploading = false
          }
        },
      )
    },
  },
})
