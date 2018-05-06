# client-compress

A JavaScript client side image compression library. This library uses the Canvas API to compress the image, and thus will not work on the node.js server-side. This library is forked from [compress.js](https://github.com/alextanhongpin/compress.js). This version has been updated to use the latest packages, uses async/await, fixes bugs, offers more options and a cleaner API.

## Advantages

- Quick compression on the client-side
- Compress multiple images and convert them to base64 string
- Save data by compressing it on the client-side before sending to the server
- Automatically resize the image to max 1920px (width or height, but maintains the aspect ratio of the images) - this is configurable
- Fix image rotation issue when uploading images from Android an iOS (uses EXIF data)

## Limitations

There are several limitations for this library:
- When working with `image/gif`, the compressed image will no longer animate.
- When working with `image/png` with transparent background, the compressed image will lose transparency and result in black background.


## Installation

```
yarn add client-compress
```

OR

```
npm install client-compress --save
```

## Import

```
const Compress = require('client-compress')
```

<!-- ### Demo -->

<!-- Try out our demo [here](https://compressjs.herokuapp.com/). -->

## Usage

See the example directory for a full example.

### Listening to an input element.

```javascript
const options = {
  targetSize: 0.2,
  quality: 0.75,
  maxWidth: 800,
  maxHeight: 600
}

const compress = new Compress(options)
const upload = document.getElementById("upload")

upload.addEventListener(
  "change",
  (evt) => {
    const files = [...evt.target.files]
    compress.compress(files).then((conversions) => {
      // Conversions is an array of objects like { photo, info }.
      // 'photo' has the photo data while 'info' contains metadata
      // about that particular image compression (e.g. time taken).

      const { photo, info } = conversions[0]

      console.log(photo)
      console.log(info)
    })
  },
  false
)
```

### Example Output

The `compress` method returns a promise which resolves to an array of objects which
take the form `{ photo, info }` where photo contains data about the output photo,
and info contains metadata about that particular compression.

Here is an example of one of the elements in the output array:

```javascript
{
  // This is the photo output
  "photo": {
    "name": "photo-1234.jpg",
    "type": "image/jpeg",
    "size": 55472.99270072992,
    "orientation": -1,
    "data": "data:image/jpeg;base64,.......................",
    "width": 800,
    "height": 435.6913183279743
  },
  // This is the metadata for this conversion
  "info": {
    "start": 3572.8999999992084,
    "quality": 0.75,
    "startWidth": 4976,
    "startHeight": 2710,
    "endWidth": 800,
    "endHeight": 435.6913183279743,
    "iterations": 1,
    "startSizeMB": 3.11684,
    "endSizeMB": 0.05547299270072992,
    "sizeReducedInPercent": 98.22021686385153,
    "end": 4180.400000004738,
    "elapsedTimeInSeconds": 0.6075000000055297
  }
}
```

## Options

| Option                | Default | Description                                                                                                                                                                                                                                                                                          |
|-----------------------|---------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| targetSize            | 1       | The target size of the photo in MB. If the image size is greater than the target size after a compression, the image is compressed with a lower quality. This happens in a loop until the next compression would make the size <= target size or the quality would be less than the minimum quality. |
| quality               | 0.75    | The initial quality to compress the image at.                                                                                                                                                                                                                                                        |
| minQuality            | 0.5     | The minimum quality allowed for an image compression. This is only relevant if the initial compression does not make the image size <= the target size.                                                                                                                                              |
| qualityStepSize       | 0.1     | The amount to try reducing the quality by in each iteration, if the image size is still > the target size.                                                                                                                                                                                           |
| maxWidth              | 1920    | The maximum width of the output image.                                                                                                                                                                                                                                                               |
| maxHeight             | 1920    | The maximum height of the output image.                                                                                                                                                                                                                                                              |
| resize                | true    | Whether the image should be resized to within the bounds set by maxWidth and maxHeight (maintains the aspect ratio).                                                                                                                                                                                 |
| throwIfSizeNotReached | false   | Whether to throw an Error if the target size is not reached.                                                                                                                                                                                                                                         |
