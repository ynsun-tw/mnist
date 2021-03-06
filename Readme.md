## Minist

This repo is a LeNet built with tensorflowjs training on mnist dataset.
We use dataset provided by [google api](https://storage.googleapis.com/learnjs-data/model-builder/mnist_images.png)

#### Dependencies

```yarn install```

#### Start local dev server

This package is served by [rollup](https://rollupjs.org/guide/en/), config is in `rollup.config.ts`

```yarn dev```

#### LeNet

About [LeNet](https://en.wikipedia.org/wiki/LeNet#:~:text=In%20general%2C%20LeNet%20refers%20to,in%20large%2Dscale%20image%20processing.)

Use this [pad](https://js.tensorflow.org/api/latest/?hl=sk#pad) function expand image to 32 * 32
example: 
```
function expandImageTo32(tensor: Tensor4D) {
  return pad(tensor, [
    [0, 0],
    [2, 2],
    [2, 2],
    [0, 0]
  ])
}
```

