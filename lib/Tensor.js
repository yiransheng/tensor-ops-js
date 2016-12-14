"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var utils_1 = require("./utils");
var Thunk_1 = require("./Thunk");

var Tensor = function () {
    function Tensor(array, shape, strides) {
        _classCallCheck(this, Tensor);

        if (array instanceof Tensor) {
            this._array = array._array;
        } else if (array instanceof Thunk_1["default"]) {
            this._array = array;
        } else {
            throw Error("Invalid Input Backing Array");
        }
        this._shape = shape;
        this._strides = strides || utils_1.computeStrides(shape);
    }

    _createClass(Tensor, [{
        key: "tolist",
        value: function tolist() {
            var _this = this;

            return this._array.map(function (a) {
                return reshape1d(a, _this._strides, _this._shape);
            }).valueOf();
        }
    }, {
        key: "toArray",
        value: function toArray() {
            return this.tolist();
        }
    }, {
        key: "flatten",
        value: function flatten() {
            var _this2 = this;

            var thunk = this._array.map(function (a) {
                return _flatten2(a, _this2._strides, _this2._shape);
            });
            var shape = [utils_1.product(this._shape)];
            return new Tensor(thunk, shape);
        }
    }, {
        key: "reshape",
        value: function reshape(newShape) {
            return new Tensor(this._getArray(), newShape);
        }
    }, {
        key: "slice",
        value: function slice(start, size) {
            var _this3 = this;

            var istart = 0;
            for (var i = 0; i < start.length; i++) {
                istart += start[i] * this._strides[i];
            }
            var thunk = this._array.map(function (a) {
                return _flatten(a, istart, _this3._strides, size);
            });
            return new Tensor(thunk, size);
        }
    }, {
        key: "transpose",
        value: function transpose(dims) {
            var _this4 = this;

            if (!dims) {
                dims = utils_1.range(0, this._shape.length, 1);
                dims.reverse();
            }
            utils_1.throwInvariant(_checkTransposeDims(dims), "Invalid transpose dimensions");
            var newShape = dims.map(function (d) {
                return _this4._shape[d];
            });
            var newStrides = dims.map(function (d) {
                return _this4._strides[d];
            });
            var newTensor = new Tensor(this, newShape, newStrides);
            return newTensor;
        }
    }, {
        key: "reduceAlongAxis",
        value: function reduceAlongAxis(axis, func, zero) {
            var newShape = this._shape.filter(function (s, i) {
                return i !== axis;
            });
            var axisLen = this._shape[axis];
            var nSlices = utils_1.product(this._shape) / axisLen;
            var stride = this._strides[axis];
            var step = this._strides[this._strides.length - 1];
            var thunk = this._array.map(function (a) {
                var istart = 0;
                var output = [];
                for (var s = 0; s < nSlices; s++) {
                    var index = istart;
                    var acc = zero;
                    var val = void 0;
                    for (var i = 0; i < axisLen; i++) {
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
    }, {
        key: "_getArray",
        value: function _getArray() {
            if (this._isTransposed()) {
                return this.flatten()._array;
            } else {
                return this._array;
            }
        }
    }, {
        key: "_isTransposed",
        value: function _isTransposed() {
            var prev = Infinity;
            for (var i = 0; i < this._strides.length; i++) {
                if (prev < this._strides[i]) {
                    return true;
                }
                prev = this._strides[i];
            }
            return false;
        }
    }]);

    return Tensor;
}();

function _flatten2(array, strides, shape) {
    return _flatten(array, 0, strides, shape);
}
function _flatten(array, start, strides, shape) {
    if (shape.length === 1) {
        return utils_1.slice1d(array, start, shape[0], strides[0]);
    }
    var size = utils_1.product(shape);

    var _shape = _toArray(shape),
        d = _shape[0],
        restShape = _shape.slice(1);

    var _strides = _toArray(strides),
        stride = _strides[0],
        restStrides = _strides.slice(1);

    var newArray = [];
    for (var i = 0; i < d; i++) {
        newArray.push(_flatten(array, start + i * stride, restStrides, restShape));
    }
    var empty = [];
    return empty.concat.apply(empty, newArray);
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
    var size = utils_1.product(shape);

    var _shape2 = _toArray(shape),
        d = _shape2[0],
        restShape = _shape2.slice(1);

    var _strides2 = _toArray(strides),
        stride = _strides2[0],
        restStrides = _strides2.slice(1);

    var newArray = [];
    for (var i = 0; i < d; i++) {
        newArray.push(_reshape1d(array, start + i * stride, restStrides, restShape));
    }
    return newArray;
}
function _checkTransposeDims(dims) {
    // check if dims is a permutation of range(dims.length)
    var prev = -1;
    for (var i = 0; i < dims.length; i++) {
        var d = dims[i];
        if (d < 0 || d >= dims.length) {
            return false;
        } else if (prev > -1 && d === prev) {
            return false;
        }
        prev = d;
    }
    return true;
}
Object.defineProperty(exports, "__esModule", { value: true });
exports["default"] = Tensor;
//# sourceMappingURL=Tensor.js.map