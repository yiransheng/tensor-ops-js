import {
  deriveShape,
  flattenArray,

  Shape,
  DeepArray
} from './utils';

import Thunk from './Thunk'
import Tensor from './Tensor';

export function tensor <T>(array: DeepArray<T>): Tensor<T> {
  const thunk = new Thunk(() => {
    return flattenArray(array);
  });
  return new Tensor(thunk, deriveShape(array));
}

export function reshape <T>(array: DeepArray<T>, shape:Shape): DeepArray<T> {
  return tensor(array).reshape(shape).tolist();
}

export function transpose <T>(array: DeepArray<T>, dims?:Shape): DeepArray<T> {
  return tensor(array).transpose(dims).tolist();
}

export default Tensor;