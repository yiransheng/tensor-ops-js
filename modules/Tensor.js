import {
  throwInvariant,
  product,
  deriveShape,
  computeStrides,
  flattenArray,
  slice1d
} from './utils';

import Thunk from './Thunk';

class Tensor {
  constructor(array, shape, strides) {
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
    this._strides = strides || computeStrides(shape);
  }
  tolist() {
    return this._array
      .map(a => reshape1d(a, this._shape, this._strides))
      .valueOf();
  }
  toArray() {
    return this.tolist();
  }
  reshape(newShape) {
    return new Tensor(this, newShape);
  }
  transpose(dims) {
    if (this._shape.length < 2) {
      return this;
    }
    if (this._shape.length === 2 && !dims) {
      dims = [1, 0];
    } 
    throwInvariant(_checkTransposeDims(dims),
        "Invalid transpose dimensions");
    const newShape  = dims.map(d => this._shape[d]);
    const newStrides = dims.map(d => this._strides[d]);
    const newTensor = new Tensor(this, newShape, newStrides);
    return newTensor;
  }
  slice(start, size) {
    
    return new Tensor(array, size);
  }
}

function reshape1d(array, shape, strides) {
  throwInvariant(array.length === product(shape),
      "Invalid Shape while reshaping 1d array");
  if (!array.length) {
    return [];
  }
  return _reshape1d(array, 0, strides, shape);
}
function _reshape1d(array, start, strides, shape) {
  if (shape.length === 1) {
    return slice1d(array, start, shape[0], strides[0]);
  }
  const size = product(shape);
  const [d, ...restShape] = shape;
  const [stride, ...restStrides] = strides;
  const newArray = [];
  for (let i=0; i<d; i++) {
    newArray.push(
      _reshape1d(array, start + i * stride, restStrides, restShape));
  }
  return newArray;
}
function _checkTransposeDims(dims) {
  // check if dims is a permutation of range(dims.length)
  let prev = -1;
  for (let i=0; i<dims.length; i++) {
    const d = dims[i];
    if (d < 0 || d >= dims.length) {
      return false;
    } else if (prev > -1 && d === prev) {
      return false;
    }
    prev = d;
  }
  return true;
}

export default Tensor;
