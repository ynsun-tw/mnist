import { layers, sequential } from '@tensorflow/tfjs'

export function createDenseModel() {
  const model = sequential()
  model.add(layers.flatten({ inputShape: [28, 28, 1] }))
  model.add(layers.dense({ units: 42, activation: 'relu' }))
  model.add(layers.dense({ units: 10, activation: 'softmax' }))
  return model
}
