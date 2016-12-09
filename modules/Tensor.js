import {
  product,
  deriveShape,
  computeStrides
} from './utils';

export default class Tensor {
  constructor(backingArray, shape, flatten=true) {
    this._shape = shape;
    this._rank = this._shape.length;
    this._size = product(this._shape);
    this._strides = computeStrides(this._shape);
    this._backingArray = flatten ? flattenDeep(backingArray) : backingArray;
  }
  _getBackingArray() {
    if (this._backingArray instanceof Tensor) {
      return this._backingArray._getBackingArray();
    } else if (Array.isArray(this._backingArray)) {
      return this._backingArray;
    }
  }
  _reshape(newShape) {
    return new Tensor(this._backingArray, newShape, false);
  }
  _transpose(dims) {
    // validation here
    const newShape = dims.map(d => this._shape[d]);
    return this._reshape(newShape);
  }
  _slice(start, end) {

  }
  toArray() {

  }
}
