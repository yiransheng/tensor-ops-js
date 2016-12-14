"use strict";
const utils_1 = require("./utils");
const Thunk_1 = require("./Thunk");
class Tensor {
    constructor(array, shape, strides) {
        if (array instanceof Tensor) {
            this._array = array._array;
        }
        else if (array instanceof Thunk_1.default) {
            this._array = array;
        }
        else {
            throw Error("Invalid Input Backing Array");
        }
        this._shape = shape;
        this._strides = strides || utils_1.computeStrides(shape);
    }
    tolist() {
        return this._array
            .map(a => reshape1d(a, this._strides, this._shape))
            .valueOf();
    }
    toArray() {
        return this.tolist();
    }
    flatten() {
        const thunk = this._array
            .map(a => flatten(a, this._strides, this._shape));
        const shape = [utils_1.product(this._shape)];
        return new Tensor(thunk, shape);
    }
    reshape(newShape) {
        return new Tensor(this._getArray(), newShape);
    }
    slice(start, size) {
        let istart = 0;
        for (let i = 0; i < start.length; i++) {
            istart += start[i] * this._strides[i];
        }
        const thunk = this._array
            .map(a => _flatten(a, istart, this._strides, size));
        return new Tensor(thunk, size);
    }
    transpose(dims) {
        if (!dims) {
            dims = utils_1.range(0, this._shape.length, 1);
            dims.reverse();
        }
        utils_1.throwInvariant(_checkTransposeDims(dims), "Invalid transpose dimensions");
        const newShape = dims.map(d => this._shape[d]);
        const newStrides = dims.map(d => this._strides[d]);
        const newTensor = new Tensor(this, newShape, newStrides);
        return newTensor;
    }
    reduceAlongAxis(axis, func, zero) {
        const newShape = this._shape.filter((s, i) => i !== axis);
        const axisLen = this._shape[axis];
        const nSlices = utils_1.product(this._shape) / axisLen;
        const stride = this._strides[axis];
        const step = this._strides[this._strides.length - 1];
        const thunk = this._array.map(a => {
            let istart = 0;
            let output = [];
            for (let s = 0; s < nSlices; s++) {
                let index = istart;
                let acc = zero;
                let val;
                for (let i = 0; i < axisLen; i++) {
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
    _getArray() {
        if (this._isTransposed()) {
            return this.flatten()._array;
        }
        else {
            return this._array;
        }
    }
    _isTransposed() {
        let prev = Infinity;
        for (let i = 0; i < this._strides.length; i++) {
            if (prev < this._strides[i]) {
                return true;
            }
            prev = this._strides[i];
        }
        return false;
    }
}
function flatten(array, strides, shape) {
    return _flatten(array, 0, strides, shape);
}
function _flatten(array, start, strides, shape) {
    if (shape.length === 1) {
        return utils_1.slice1d(array, start, shape[0], strides[0]);
    }
    const size = utils_1.product(shape);
    const [d, ...restShape] = shape;
    const [stride, ...restStrides] = strides;
    const newArray = [];
    for (let i = 0; i < d; i++) {
        newArray.push(_flatten(array, start + i * stride, restStrides, restShape));
    }
    const empty = [];
    return empty.concat(...newArray);
}
function reshape1d(array, strides, shape) {
    utils_1.throwInvariant(array.length === utils_1.product(shape), "Invalid Shape while reshaping 1d array");
    if (!array.length) {
        return [];
    }
    return _reshape1d(array, 0, strides, shape);
}
function _reshape1d(array, start, strides, shape) {
    if (shape.length === 1) {
        return utils_1.slice1d(array, start, shape[0], strides[0]);
    }
    const size = utils_1.product(shape);
    const [d, ...restShape] = shape;
    const [stride, ...restStrides] = strides;
    const newArray = [];
    for (let i = 0; i < d; i++) {
        newArray.push(_reshape1d(array, start + i * stride, restStrides, restShape));
    }
    return newArray;
}
function _checkTransposeDims(dims) {
    // check if dims is a permutation of range(dims.length)
    let prev = -1;
    for (let i = 0; i < dims.length; i++) {
        const d = dims[i];
        if (d < 0 || d >= dims.length) {
            return false;
        }
        else if (prev > -1 && d === prev) {
            return false;
        }
        prev = d;
    }
    return true;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Tensor;
//# sourceMappingURL=Tensor.js.map