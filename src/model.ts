import { layers, sequential } from '@tensorflow/tfjs'

export function createModel() {
  const model = sequential()

  model.add(
    layers.conv2d({
      inputShape: [32, 32, 1], //输入张量的形状
      kernelSize: 5, //卷积核尺寸
      filters: 6, //卷积核数量
      strides: 1, //卷积核移动步长
      activation: 'tanh'
    })
  )

  model.add(
    layers.maxPooling2d({
      poolSize: [2, 2], //滑动窗口尺寸
      strides: [2, 2] //滑动窗口移动步长
    })
  )

  model.add(layers.activation({ activation: 'sigmoid' }))

  model.add(
    layers.conv2d({
      kernelSize: 5, //卷积核尺寸
      filters: 16, //卷积核数量
      strides: 1, //卷积核移动步长
      activation: 'tanh' //激活函数
    })
  )

  model.add(
    layers.maxPooling2d({
      poolSize: [2, 2], //滑动窗口尺寸
      strides: [2, 2] //滑动窗口移动步长
    })
  )

  model.add(layers.activation({ activation: 'sigmoid' }))

  model.add(
    layers.conv2d({
      kernelSize: 5, //卷积核尺寸
      filters: 120, //卷积核数量
      strides: 1, //卷积核移动步长
      activation: 'tanh' //激活函数
    })
  )

  model.add(layers.flatten())

  model.add(layers.dense({ units: 84, activation: 'tanh' }))
  model.add(layers.dense({ units: 10, activation: 'softmax' }))

  model.summary()
  return model
}
