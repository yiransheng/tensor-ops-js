# tensor-ops

## Goal

Emulate a good chunk of `numpy` and `tensorflow`'s tensor related apis.

## Non-goal

Speed and performance.



## Usage

`tensor-ops` uses plain Array as storage, TypedArray is currently not supported. 



### Array based API

* `reshape`

  ```
  import {reshape} from 'tensor-ops';

  reshape([[1,2,3], [4,5,6]], [3, 2]); // [[1,2], [3,4], [5,6]]
  ```

* `transpose`

  ```
  import {transpose} from 'tensor-ops';

  transpose([[1, 1], [0, 1]]); // [[1,0], [1,1]]
  transpose([[[ 0,  1],
              [ 2,  3],
              [ 4,  5]],

             [[ 6,  7],
              [ 8,  9],
              [10, 11]]], [1, 0, 2]);
  // [[[ 0,  1],
  //   [ 6,  7]],
  //
  //   [[ 2,  3],
  //   [ 8,  9]],
  // 
  //   [[ 4,  5],
  //   [10, 11]]])
  ```

### Lazy Tensor Class Based API 

```
import {tensor} from 'tensor-ops';

tensor([1, 2, 3, 4, 5, 6])  // creates a Tensor instance, a lazy representation of ndarray
  .reshape([2, 3])          // chaining creates new Tensors 
  .transpose()              // transpose is cheap, it just updates strides
  .slice([1, 0], [2, 2])    
  .tolist()
  
// [[1, 4],
//  [2, 5]]
```

