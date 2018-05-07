"use strict"

const options = {
  targetSize: 0.15,
  quality: 0.75,
  maxWidth: 1600,
  maxHeight: 1600
}

const compress = new Compress(options)
const preview = document.getElementById("preview")

const upload = document.getElementById("upload")

function displayObject(obj, elId) {
  const el = document.getElementById(elId)
  let html = "<table border='1'>"
  for (const [key, value] of Object.entries(obj)) {
    if (!key.startsWith("_")) {
      html += `
      <tr>
        <th>${key}</th>
        <td>${value}</td>
      </tr>`
    }
  }
  html += "</table>"
  el.innerHTML = html
}

upload.addEventListener(
  "change",
  (evt) => {
    const files = [...evt.target.files]
    compress.compress(files).then((conversions) => {
      const { photo, info } = conversions[0]

      console.log({photo, info})

      // Create an object URL which points to the photo Blob data
      const objectUrl = URL.createObjectURL(photo.data)

      // Set the preview img src to the object URL and wait for it to load
      Compress.loadImageElement(preview, objectUrl).then(() => {
        // Revoke the object URL to free up memory
        URL.revokeObjectURL(objectUrl)
      })

      displayObject(photo, 'output-photo')
      displayObject(info, 'output-info')
    })
  },
  false
)
