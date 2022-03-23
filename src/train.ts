import * as ui from './ui'
import { nextFrame } from '@tensorflow/tfjs'

export async function train(data, model, onIteration) {
  ui.logStatus('Training model...')
  const optimizer = 'adam'

  model.compile({
    optimizer,
    loss: 'categoricalCrossentropy',
    metrics: ['accuracy']
  })

  const batchSize = 64

  const validationSplit = 0.15

  const trainEpochs = ui.getTrainEpochs()

  let trainBatchCount = 0

  const trainData = data.getTrainData()
  const testData = data.getTestData()

  const totalNumBatches =
    Math.ceil((trainData.xs.shape[0] * (1 - validationSplit)) / batchSize) * trainEpochs

  let valAcc
  await model.fit(trainData.xs, trainData.labels, {
    batchSize,
    validationSplit,
    epochs: trainEpochs,
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        trainBatchCount++
        ui.logStatus(
          `Training... (` +
            `${((trainBatchCount / totalNumBatches) * 100).toFixed(1)}%` +
            ` complete). To stop training, refresh or close page.`
        )
        ui.plotLoss(trainBatchCount, logs.loss, 'train')
        ui.plotAccuracy(trainBatchCount, logs.acc, 'train')
        if (onIteration && batch % 10 === 0) {
          onIteration('onBatchEnd', batch, logs)
        }
        await nextFrame()
      },
      onEpochEnd: async (epoch, logs) => {
        valAcc = logs.val_acc
        ui.plotLoss(trainBatchCount, logs.val_loss, 'validation')
        ui.plotAccuracy(trainBatchCount, logs.val_acc, 'validation')
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
    `Final validation accuracy: ${finalValAccPercent.toFixed(1)}%; ` +
      `Final test accuracy: ${testAccPercent.toFixed(1)}%`
  )
}
