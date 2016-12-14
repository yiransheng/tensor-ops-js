import {
  throwInvariant,
  product,
  deriveShape,
  computeStrides,
  flattenArray,
  range,
  slice1d,

  Shape,
  DeepArray
} from './utils';

import Thunk from './Thunk';

class Tensor<T> {
  readonly _array: Thunk<T[]>;
  readonly _shape: Shape;
  readonly _strides: Shape;

  constructor(array: Tensor<T> | Thunk<T[]>, shape:Shape, strides?:Shape) {
    if (array instanceof Tensor) {
      this._array = array._array;
    } else if (array instanceof Thunk) {
      this._array = array;
    } else {
      throw Error("Invalid Input Backing Array");
    }
    this._shape = shape;
    this._strides = strides || computeStrides(shape);
  }
  tolist():DeepArray<T> {
    return this._array
      .map(a => reshape1d(a, this._strides, this._shape))
      .valueOf();
  }
  toArray() {
    return this.tolist();
  }
  flatten():Tensor<T> {
    const thunk:Thunk<T[]> = this._array
      .map(a => flatten(a, this._strides, this._shape));
    const shape:Shape = [product(this._shape)];
    return new Tensor(thunk, shape);
  }
  reshape(newShape:Shape):Tensor<T> {
    return new Tensor(this._getArray(), newShape);
  }
  slice(start:Shape, size:Shape):Tensor<T> {
    let istart = 0;
    for (let i=0; i<start.length; i++) {
      istart += start[i] * this._strides[i];
    }
    const thunk = this._array
      .map(a => _flatten(a, istart, this._strides, size))
    return new Tensor(thunk, size);
  }
  transpose(dims?:Shape):Tensor<T> {
    if (!dims) {
      dims = range(0, this._shape.length, 1);
      dims.reverse();
    }
    throwInvariant(_checkTransposeDims(dims),
        "Invalid transpose dimensions");
    const newShape  = dims.map(d => this._shape[d]);
    const newStrides = dims.map(d => this._strides[d]);
    const newTensor = new Tensor(this, newShape, newStrides);
    return newTensor;
  }
  reduceAlongAxis<U>(axis:number, func: (a:U, b:T)=>U, zero:U) {
    const newShape = this._shape.filter((s, i) => i !== axis);
    const axisLen = this._shape[axis];
    const nSlices = product(this._shape) / axisLen;
    const stride = this._strides[axis];
    const step = this._strides[this._strides.length-1];
    const thunk = this._array.map(a => {
      let istart = 0;
      let output:U[] = [];
      for (let s=0; s<nSlices; s++) {
        let index = istart;
        let acc = zero;
        let val:T;
        for (let i=0; i<axisLen; i++) {
          val = a[index];
          acc = func(acc, val);
          index = index + stride; 
        }
        output.push(acc);
        istart = istart + step;
      }
      return output;
    });
    return new Tensor(thunk, newShape);
  }
  _getArray():Thunk<T[]> {
    if (this._isTransposed()) {
      return this.flatten()._array;
    } else {
      return this._array;
    }
  }
  _isTransposed():boolean {
    let prev = Infinity;
    for (let i=0; i<this._strides.length; i++) {
      if (prev < this._strides[i]) {
        return true;
      }
      prev = this._strides[i];
    }
    return false;
  }
}

function flatten<T>(array:T[], strides:Shape, shape:Shape):T[] {
  return _flatten(array, 0, strides, shape);
}

function _flatten<T>(array:T[], start:number, strides:Shape, shape:Shape):T[] {
  if (shape.length === 1) {
    return slice1d(array, start, shape[0], strides[0]);
  }
  const size = product(shape);
  const [d, ...restShape] = shape;
  const [stride, ...restStrides] = strides;
  const newArray:T[][] = [];
  for (let i=0; i<d; i++) {
    newArray.push(
      _flatten(array, start + i * stride, restStrides, restShape));
  }
  const empty: T[] = [];
  return empty.concat(...newArray);
}

function reshape1d<T>(array:T[], strides:Shape, shape:Shape):DeepArray<T> {
  throwInvariant(array.length === product(shape),
      "Invalid Shape while reshaping 1d array");
  if (!array.length) {
    return [];
  }
  return _reshape1d(array, 0, strides, shape);
}
function _reshape1d<T>(array:T[], start:number, strides:Shape, shape:Shape):DeepArray<T> {
  if (shape.length === 1) {
    return slice1d(array, start, shape[0], strides[0]);
  }
  const size = product(shape);
  const [d, ...restShape] = shape;
  const [stride, ...restStrides] = strides;
  const newArray:DeepArray<T> = [];
  for (let i=0; i<d; i++) {
    newArray.push(
      _reshape1d(array, start + i * stride, restStrides, restShape));
  }
  return newArray;
}
function _checkTransposeDims(dims:Shape):boolean {
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
