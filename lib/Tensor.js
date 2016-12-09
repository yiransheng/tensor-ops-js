'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _utils = require('./utils');

var _Thunk = require('./Thunk');

var _Thunk2 = _interopRequireDefault(_Thunk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Tensor = function () {
  function Tensor(array, shape) {
    _classCallCheck(this, Tensor);

    if (array instanceof Tensor) {
      this._array = array._array;
    } else if (array instanceof _Thunk2['default']) {
      this._array = array;
    } else if (Array.isArray(array)) {
      this._array = new _Thunk2['default'](function () {
        return (0, _utils.flattenArray)(array);
      });
    } else {
      throw Error("Invalid Input Backing Array");
    }
    this._shape = shape;
    this._strides = (0, _utils.computeStrides)(shape);
  }

  _createClass(Tensor, [{
    key: 'tolist',
    value: function tolist() {
      var _this = this;

      return this._array.map(function (a) {
        return reshape1d(a, _this._shape);
      }).valueOf();
    }
  }, {
    key: 'toArray',
    value: function toArray() {
      return this.tolist();
    }
  }, {
    key: 'reshape',
    value: function reshape(newShape) {
      return new Tensor(this, newShape);
    }
  }]);

  return Tensor;
}();

function reshape1d(array, shape) {
  (0, _utils.throwInvariant)(array.length === (0, _utils.product)(shape), "Invalid Shape while reshaping 1d array");
  return _reshape1d(array, 0, array.length, shape);
}
function _reshape1d(array, start, len, shape) {
  if (shape.length === 1) {
    return array.slice(start, start + len);
  }

  var _shape = _toArray(shape),
      d = _shape[0],
      rest = _shape.slice(1);

  var nextLen = len / d;
  var newArray = [];
  for (var i = 0; i < d; i++) {
    newArray.push(_reshape1d(array, start + i * nextLen, nextLen, rest));
  }
  return newArray;
}

exports['default'] = Tensor;