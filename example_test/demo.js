"use strict"

const options = {
  targetSize: 0.15,
  quality: 0.75,
  maxWidth: 1600,
  maxHeight: 1600
}

const compress = new Compress(options)
const preview = document.getElementById("preview")
const output = document.getElementById("output")

const upload = document.getElementById("upload")

upload.addEventListener(
  "change",
  (evt) => {
    const files = [...evt.target.files]
    compress.compress(files).then((conversions) => {
      const { photo, info } = conversions[0]

      console.log({ photo, info })

      Compress.blobToBase64(photo.data).then((base64) => {
        preview.src = base64
      })
    })
  },
  false
)
