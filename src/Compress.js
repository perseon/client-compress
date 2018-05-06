import base64 from "./core/base64"
import converter from "./core/converter"
import image from "./core/image"
import Photo from "./core/Photo"

class Compress {
  constructor(options) {
    this.options = options
  }

  async _compressFile(file) {
    const conversion = {}
    conversion.start = window.performance.now()
    conversion.quality = this.options.quality

    // Create a new photo object
    const photo = new Photo(file)

    // Load the file into the photo object
    await photo.load()

    return await this._compressImage(photo, conversion)
  }

  async _compressImage(photo, conversion) {
    // Store the initial dimensions
    conversion.startWidth = photo.width
    conversion.startHeight = photo.height

    // Resize the image
    let newWidth, newHeight

    if (this.options.resize) {
      const resizedDims = image.resize(
        photo.width,
        photo.height,
        this.options.maxWidth,
        this.options.maxHeight
      )
      newWidth = resizedDims.width
      newHeight = resizedDims.height
    } else {
      newWidth = photo.width
      newHeight = photo.height
    }

    conversion.endWidth = newWidth
    conversion.endHeight = newHeight

    // Create a canvas element and resize the image onto the canvas
    const canvas = photo.getCanvas(newWidth, newHeight)

    // Initialise some variables for recursive call
    conversion.iterations = 0
    conversion.startSizeMB = converter.size(photo.size).MB

    await this._loopCompression(
      canvas,
      photo,
      conversion
    )

    conversion.endSizeMB = converter.size(photo.size).MB
    conversion.sizeReducedInPercent = (conversion.startSizeMB - conversion.endSizeMB) / conversion.startSizeMB * 100

    conversion.end = window.performance.now()
    conversion.elapsedTimeInSeconds = (conversion.end - conversion.start) / 1000

    return {photo, info: conversion}
  }

  _loopCompression(
    canvas,
    photo,
    conversion
  ) {
    conversion.iterations++

    photo.data = converter.canvasToBase64(canvas, conversion.quality)
    photo.size = base64.size(photo.data)

    if (converter.size(photo.size).MB > this.options.targetSize) {
      // toFixed avoids floating point errors messing with inequality
      if (conversion.quality.toFixed(10) - 0.1 < this.options.minQuality) {
        // throw new Error("Couldn't compress image to specified max size")
        console.error("Ran out")
        return
      } else {
        conversion.quality -= this.options.qualityStepSize
        return this._loopCompression(
          canvas,
          photo,
          conversion
        )
      }
    } else {
      return
    }
  }

  compress(files) {
    return Promise.all(files.map((file) => this._compressFile(file)))
  }

  // static convertBase64ToFile(base64, mime) {
  //   return converter.base64ToFile(base64, mime)
  // }
}

// Supported input formats
// image/png, image/jpeg, image/jpg, image/gif, image/bmp, image/tiff, image/x-icon,  image/svg+xml, image/webp, image/xxx
// image/png, image/jpeg, image/webp
export default Compress
