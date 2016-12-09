import {
  throwInvariant,
  product,
  deriveShape,
  computeStrides,
  flattenArray
} from './utils';

import Thunk from './Thunk';

class Tensor {
  constructor(array, shape) {
    if (array instanceof Tensor) {
      this._array = array._array;
    } else if (array instanceof Thunk) {
      this._array = array;
    } else if (Array.isArray(array)) {
      this._array = new Thunk(() => {
        return flattenArray(array);
      });
    } else {
      throw Error("Invalid Input Backing Array");
    }
    this._shape = shape;
    this._strides = computeStrides(shape);
  }
  tolist() {
    return this._array
      .map(a => reshape1d(a, this._shape))
      .valueOf();
  }
  toArray() {
    return this.tolist();
  }
  reshape(newShape) {
    return new Tensor(this, newShape);
  }
}

function reshape1d(array, shape) {
  throwInvariant(array.length === product(shape),
      "Invalid Shape while reshaping 1d array");
  return _reshape1d(array, 0, array.length, shape);
}
function _reshape1d(array, start, len, shape) {
  if (shape.length === 1) {
    return array.slice(start, start + len);
  }
  const [d, ...rest] = shape;
  const nextLen = len / d;
  const newArray = [];
  for (let i=0; i<d; i++) {
    newArray.push(
      _reshape1d(array, start + i * nextLen, nextLen, rest));
  }
  return newArray;
}

export default Tensor;
