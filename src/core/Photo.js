import fileUtils from "./file"
import rotate from "./rotate"
import imageUtils from "./image"
import converter from "./converter"

// The photo model
export default class Photo {
  constructor(file) {
    this._file = file
    this.name = file.name
    this.type = file.type
    this.size = file.size
  }

  async _calculateOrientation() {
    const orientation = await rotate.orientation(this._file)
    this.orientation =  orientation
  }

  async load() {
    await this._calculateOrientation()
    const data = await fileUtils.load(this._file) // base64 data URL
    this.data = data

    const img = await imageUtils.load(data)
    this._img = img
    this.width = img.naturalWidth
    this.height = img.naturalHeight
  }

  getCanvas(width, height) {
    return converter.imageToCanvas(
      this._img,
      width,
      height,
      this.orientation
    )
  }
}
