import { defineStore } from 'pinia'
import { ref as storageRef, uploadBytesResumable } from 'firebase/storage'
import { storage } from '@/firebase'
import { useSkateparkStore } from './SkateparkStore'
import { useUserStore } from './UserStore'
import { doc, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

function sanitizeAndRenameFile(file, userId) {
  const extension = file.name.split('.').pop()
  const timestamp = Date.now()

  const safeFilename = `img--${userId}--${timestamp}.${extension}`

  return new File([file], safeFilename, { type: file.type })
}

export const useUploadsStore = defineStore('UploadsStore', {
  state: () => ({
    uploadProgress: 0,
    uploadError: null,
    uploadedImageUrl: null,
    isUploading: false,
    isProcessing: false,
    photoUrls: [],
    photoIds: [],
  }),

  actions: {
    async uploadImage(file) {
      this.isUploading = true
      this.uploadProgress = 0
      this.uploadError = null
      // this.uploadedImageUrl = null
      this.isProcessing = false

      const skateparkStore = useSkateparkStore()
      const userStore = useUserStore()

      const parkId = skateparkStore.getCurrentPark.id
      const userId = userStore.user.uid
      const renamedFile = sanitizeAndRenameFile(file, userId)
      const filePath = `images/${parkId}/${userId}/${renamedFile.name}`
      const fileRef = storageRef(storage, filePath)
      const imageId = renamedFile.name.split('.')[0] // removes .jpg, .png, etc.

      const uploadTask = uploadBytesResumable(fileRef, renamedFile)

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
          // Original upload complete
          this.isProcessing = true

          // Manually create Firestore doc (Cloud Function will update it later)
          const docRef = doc(db, 'images', imageId)
          await setDoc(
            docRef,
            {
              parkId,
              userId,
              displayName: userStore.user.displayName,
              createdAt: Date.now(),
              status: 'uploaded',
            },
            { merge: true },
          )

          // Listen for updates from Cloud Function
          onSnapshot(docRef, (docSnap) => {
            const data = docSnap.data()

            console.log('we have the photo: ', data)

            if (data?.smUrl && data?.lgUrl) {
              this.photoUrls.push({
                sm: data.smUrl,
                lg: data.lgUrl,
              })
              this.photoIds.push(imageId)
              // this.uploadedImageUrl = data.smUrl
              this.isUploading = false
              this.isProcessing = false
            }
          })
        },
      )
    },
  },
})
