import * as ui from './ui'
import { nextFrame } from '@tensorflow/tfjs'

export async function train(data, model, onIteration) {
  model.compile({
    optimizer: 'adam',
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  })

  const trainData = data.getTrainData()
  const testData = data.getTestData()

  const validationSplit = 0.15

  const batchSize = 64

  let trainBatchCount = 0

  let valAcc

  const trainEpochs = ui.getTrainEpochs()

  const totalNumberBatches =
    Math.ceil((trainData.xs.shape[0] * (1 - validationSplit)) / batchSize) * trainEpochs

  await model.fit(trainData.xs, trainData.labels, {
    batchSize,
    validationSplit,
    epochs: trainEpochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        trainBatchCount++
        ui.logStatus(`Training... (${((trainBatchCount / totalNumberBatches) * 100).toFixed(1)}% )`)
        ui.plotLoss(trainBatchCount, logs.loss, 'train')
        ui.plotAccuracy(trainBatchCount, logs.acc, 'train')
        if (onIteration && batch % 10 === 0) {
          onIteration('onBachEnd', batch, logs)
        }
        await nextFrame()
      },
      onEpochEnd: async (epoch, logs) => {
        valAcc = logs.val_acc
        if (onIteration) {
          onIteration('onEpochEnd', epoch, logs)
        }
        await nextFrame()
      }
    }
  })

  const testResult = model.evaluate(testData.xs, testData.labels)
  const testAccPercent = testResult[1].dataSync()[0] * 100
  const finalValAccPercent = valAcc * 100

  ui.logStatus(
    `Final validation accuracy: ${finalValAccPercent.toFixed(1)}%` +
      `Final test accuracy: ${testAccPercent.toFixed(1)}`
  )
}
