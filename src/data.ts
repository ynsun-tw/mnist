import { tensor4d, tensor2d, pad } from '@tensorflow/tfjs'
import { Tensor4D } from '@tensorflow/tfjs-core/dist/tensor'

export const IMAGE_H = 28
export const IMAGE_W = 28
const IMAGE_SIZE = IMAGE_H * IMAGE_W
const NUM_CLASSES = 10
const NUM_DATASET_ELEMENTS = 65000

const NUM_TRAIN_ELEMENTS = 55000
const NUM_TEST_ELEMENTS = NUM_DATASET_ELEMENTS - NUM_TRAIN_ELEMENTS
const MNIST_IMAGES_SPRITE_PATH = new URL('../dataset/images.png', import.meta.url).href
const MNIST_LABELS_PATH = new URL('../dataset/labels', import.meta.url).href

// const MNIST_IMAGES_SPRITE_PATH =
//   'https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png'
// const MNIST_LABELS_PATH =
//   'https://storage.googleapis.com/learnjs-data/model-builder/mnist_labels_uint8'

export class MnistData {
  datasetLabels: Uint8Array = new Uint8Array([])
  datasetImages
  trainImages
  testImages
  trainLabels
  testLabels

  constructor() {}

  async load() {
    // Make a request for the MNIST sprited image.
    const img = new Image()
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const imgRequest = await new Promise((resolve, reject) => {
      img.crossOrigin = ''
      img.onload = () => {
        img.width = img.naturalWidth
        img.height = img.naturalHeight

        const datasetBytesBuffer = new ArrayBuffer(NUM_DATASET_ELEMENTS * IMAGE_SIZE * 4)

        const chunkSize = 5000
        canvas.width = img.width
        canvas.height = chunkSize

        for (let i = 0; i < NUM_DATASET_ELEMENTS / chunkSize; i++) {
          const datasetBytesView = new Float32Array(
            datasetBytesBuffer,
            i * IMAGE_SIZE * chunkSize * 4,
            IMAGE_SIZE * chunkSize
          )
          ctx.drawImage(img, 0, i * chunkSize, img.width, chunkSize, 0, 0, img.width, chunkSize)

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)

          for (let j = 0; j < imageData.data.length / 4; j++) {
            // All channels hold an equal value since the image is grayscale, so
            // just read the red channel.
            datasetBytesView[j] = imageData.data[j * 4] / 255
          }
        }
        this.datasetImages = new Float32Array(datasetBytesBuffer)

        resolve(1)
      }
      img.src = MNIST_IMAGES_SPRITE_PATH
    })

    const labelsRequest = fetch(MNIST_LABELS_PATH)
    const [imgResponse, labelsResponse] = await Promise.all([imgRequest, labelsRequest])

    this.datasetLabels = new Uint8Array(await labelsResponse.arrayBuffer())

    // Slice the the images and labels into train and test sets.
    this.trainImages = this.datasetImages.slice(0, IMAGE_SIZE * NUM_TRAIN_ELEMENTS)
    this.testImages = this.datasetImages.slice(IMAGE_SIZE * NUM_TRAIN_ELEMENTS)
    this.trainLabels = this.datasetLabels.slice(0, NUM_CLASSES * NUM_TRAIN_ELEMENTS)
    this.testLabels = this.datasetLabels.slice(NUM_CLASSES * NUM_TRAIN_ELEMENTS)
  }

  getTrainData() {
    const xs = expandImageTo32(
      tensor4d(this.trainImages, [this.trainImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1])
    )
    const labels = tensor2d(this.trainLabels, [this.trainLabels.length / NUM_CLASSES, NUM_CLASSES])
    return { xs, labels }
  }

  getTestData(numExamples) {
    let xs = expandImageTo32(
      tensor4d(this.testImages, [this.testImages.length / IMAGE_SIZE, IMAGE_H, IMAGE_W, 1])
    )

    let labels = tensor2d(this.testLabels, [this.testLabels.length / NUM_CLASSES, NUM_CLASSES])

    if (numExamples != null) {
      xs = xs.slice([0, 0, 0, 0], [numExamples, 28, 28, 1])
      labels = labels.slice([0, 0], [numExamples, NUM_CLASSES])
    }
    return { xs, labels }
  }
}

function expandImageTo32(tensor: Tensor4D) {
  return tensor
}
