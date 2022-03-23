import { tidy } from '@tensorflow/tfjs'
import { MnistData } from './data'
import * as ui from './ui'
import { createModel } from './model'
import { train } from './train'

async function showPredictions(data, model) {
  const testExamples = 100
  const examples = data.getTestData(testExamples)

  tidy(() => {
    const output = model.predict(examples.xs)

    const axis = 1
    const labels = Array.from(examples.labels.argMax(axis).dataSync())
    const predictions = Array.from(output.argMax(axis).dataSync())

    ui.showTestResults(examples, predictions, labels)
  })
}

async function load() {
  const data = new MnistData()
  await data.load()
  return data
}

ui.setTrainButtonCallback(async () => {
  ui.logStatus('Loading MNIST data...')
  const data = await load()

  ui.logStatus('Creating model...')
  const model = createModel()
  model.summary()

  ui.logStatus('Starting model training...')
  await train(data, model, () => showPredictions(data, model))
})
