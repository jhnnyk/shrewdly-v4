const { onObjectFinalized } = require('firebase-functions/v2/storage')
const { initializeApp } = require('firebase-admin/app')
const { getStorage } = require('firebase-admin/storage')
const admin = require('firebase-admin')
const CloudConvert = require('cloudconvert')
const path = require('path')
const os = require('os')
const fs = require('fs')

const { defineSecret } = require('firebase-functions/params')
const CLOUDCONVERT_API_KEY = defineSecret('CLOUDCONVERT_API_KEY')

initializeApp()
const db = admin.firestore()
const bucket = getStorage().bucket()

exports.saveResizedImageMetadata = onObjectFinalized(async (event) => {
  const object = event.data
  const filePath = object.name
  if (!filePath || !filePath.includes('/resized/')) return

  const contentType = object.contentType || ''
  if (!contentType.startsWith('image/')) return

  const bucket = getStorage().bucket(object.bucket)
  const file = bucket.file(filePath)

  const [downloadUrl] = await file.getSignedUrl({
    action: 'read',
    expires: '03-01-2500',
  })

  // Parse identifiers from path
  const parts = filePath.split('/')
  const parkId = parts[1]
  const userId = parts[2]
  const filename = parts[4] // e.g. photo_200x200.jpeg

  // Get base image ID
  const baseName = filename.split('_')[0] // "photo"
  const sizeSuffix = filename.split('_')[1] || '' // "200x200.jpeg"
  const imageId = `${parkId}_${userId}_${baseName}`

  // Determine which field to update
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

exports.convertHeicToJpg = onObjectFinalized(
  {
    timeoutSeconds: 60,
    secrets: [CLOUDCONVERT_API_KEY], // ✅ Attach the secret to the function
  },
  async (event) => {
    const apiKey = CLOUDCONVERT_API_KEY.value()
    const cloudConvert = new CloudConvert(apiKey)

    const object = event.data
    const filePath = object.name
    const contentType = object.contentType

    if (!filePath || !contentType || !contentType.includes('heic')) return
    console.log(`Detected HEIC upload: ${filePath}`)

    const fileName = path.basename(filePath, path.extname(filePath))
    const tmpFilePath = path.join(os.tmpdir(), `${fileName}.HEIC`)
    const jpgFilePath = path.join(os.tmpdir(), `${fileName}.jpg`)
    const destPath = filePath.replace(/\.heic$/i, '.jpg')

    // Download original .heic to /tmp
    await bucket.file(filePath).download({ destination: tmpFilePath })

    // Create conversion job
    const job = await cloudConvert.jobs.create({
      tasks: {
        'import-1': {
          operation: 'import/upload',
        },
        'convert-1': {
          operation: 'convert',
          input: 'import-1',
          output_format: 'jpg',
        },
        'export-1': {
          operation: 'export/url',
          input: 'convert-1',
        },
      },
    })

    const uploadTask = job.tasks.filter((task) => task.name === 'import-1')[0]
    const uploadUrl = uploadTask.result.form.url
    const uploadParams = uploadTask.result.form.parameters

    const FormData = require('form-data')
    const axios = require('axios')
    const form = new FormData()

    for (const [key, value] of Object.entries(uploadParams)) {
      form.append(key, value)
    }

    form.append('file', fs.createReadStream(tmpFilePath))

    await axios.post(uploadUrl, form, { headers: form.getHeaders() })

    // Wait for job to finish
    const completedJob = await cloudConvert.jobs.wait(job.id)
    const exportTask = completedJob.tasks.find((task) => task.name === 'export-1')

    const fileUrl = exportTask.result.files[0].url

    // Download converted jpg
    const jpgRes = await axios.get(fileUrl, { responseType: 'arraybuffer' })
    fs.writeFileSync(jpgFilePath, jpgRes.data)

    // Upload to Firebase Storage
    await bucket.upload(jpgFilePath, {
      destination: destPath,
      metadata: { contentType: 'image/jpeg' },
    })

    console.log(`✅ Converted and uploaded: ${destPath}`)

    // Delete original
    await bucket.file(filePath).delete()

    // Clean up
    fs.unlinkSync(tmpFilePath)
    fs.unlinkSync(jpgFilePath)
  },
)
