"use strict"

const options = {
  targetSize: 0.15, // the max size in MB, defaults to 2MB
  quality: 0.75, // the quality of the image, max is 1,
  minQuality: 0.5,
  qualityStepSize: 0.1,
  maxWidth: 1920, // the max width of the output image, defaults to 1920px
  maxHeight: 1920, // the max height of the output image, defaults to 1920px
  resize: true // defaults to true, set false if you do not want to resize the image width and height
}

const compress = new Compress(options)
const preview = document.getElementById("preview")
const output = document.getElementById("output")

const upload = document.getElementById("upload")

upload.addEventListener(
  "change",
  (evt) => {
    const files = [...evt.target.files]
    compress
      .compress(files)
      .then((conversions) => {
        // console.log(conversions)
        const {photo, info} = conversions[0]

        preview.src = photo.data

        console.log(photo)
        console.log(info)

      })
  },
  false
)
