const { onObjectFinalized } = require('firebase-functions/v2/storage')
const { initializeApp } = require('firebase-admin/app')
const { getStorage } = require('firebase-admin/storage')
const admin = require('firebase-admin')

initializeApp()
const db = admin.firestore()

exports.saveResizedImageMetadata = onObjectFinalized(async (event) => {
  const object = event.data
  const filePath = object.name
  if (!filePath || !filePath.includes('/resized/')) return

  const contentType = object.contentType || ''
  if (!contentType.startsWith('image/')) return

  const bucket = getStorage().bucket(object.bucket)
  const file = bucket.file(filePath)

  const [metadata] = await file.getMetadata()
  const [downloadUrl] = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  })

  const parts = filePath.split('/')
  const parkId = parts[1]
  const userId = parts[2]
  const filename = parts[4]

  const baseName = filename.split('_')[0]
  const sizeSuffix = filename.split('_')[1] || ''
  const imageId = `${parkId}_${userId}_${baseName}`
  const sizeKey = sizeSuffix.includes('600') ? 'lgUrl' : 'smUrl'

  const docRef = db.collection('images').doc(imageId)
  await docRef.set(
    {
      parkId,
      userId,
      [sizeKey]: downloadUrl,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true },
  )

  console.log(`✅ Stored ${sizeKey} for ${filePath}`)
})
