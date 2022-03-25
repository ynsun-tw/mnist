import { layers, sequential } from '@tensorflow/tfjs'

export function createDenseModel() {
  const model = sequential()
  model.add(layers.flatten({ inputShape: [28, 28, 1] }))
  model.add(layers.dense({ units: 42, activation: 'relu' }))
  model.add(layers.dense({ units: 10, activation: 'softmax' }))
  return model
}

export function ConvModel() {
  const model = sequential()
  model.add(
    layers.conv2d({
      inputShape: [28, 28, 1],
      kernelSize: 3,
      filters: 16,
      activation: 'relu'
    })
  )

  model.add(layers.maxPooling2d({ poolSize: 2, strides: 2 }))

  model.add(layers.flatten({ inputShape: [13, 13, 16] }))
  model.add(layers.dense({ units: 42, activation: 'relu' }))
  model.add(layers.dense({ units: 10, activation: 'softmax' }))

  return model
}
