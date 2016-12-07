"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.throwInvariant = throwInvariant;
exports.isTensor = isTensor;
exports.shape = shape;
exports.shapeEqual = shapeEqual;
exports.tensor = tensor;
exports.toArray = toArray;
exports.add = add;
exports.times = times;
exports.sum = sum;
exports.product = product;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var _SHAPE_KEY = exports._SHAPE_KEY = Symbol("shape");

function throwInvariant(condition, message) {
  if (!condition) {
    throw Error(message);
  }
}

function isTensor(t) {
  return Array.isArray(t) && t[_SHAPE_KEY];
}

function shape(t) {
  return isTensor(t) ? t[_SHAPE_KEY] : deriveShape(t);
}

function shapeEqual() {
  for (var _len = arguments.length, shapes = Array(_len), _key = 0; _key < _len; _key++) {
    shapes[_key] = arguments[_key];
  }

  if (shapes.length < 2) {
    return true;
  }
  var last = shapes.pop();
  while (shapes.length) {
    if (!_shapeEqual(last, shapes.pop())) return false;
  }
  return true;
}
function _shapeEqual(a, b) {
  var checkArray = Array.isArray(a) && Array.isArray(b) && a.length === b.length;
  if (checkArray) {
    var len = a.length;
    for (var i = 0; i < len; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  } else {
    return false;
  }
}

function tensor(array) {
  if (isTensor(array)) {
    return array;
  } else if (Array.isArray(array)) {
    array[_SHAPE_KEY] = deriveShape(array);
    return array;
  }

  throwInvariant(false, "Tensors can be only made from arrays");
}

function deriveShape(array) {
  if (!Array.isArray(array)) {
    return []; // a scalar
  }
  var n = array.length;
  if (n > 0) {
    var childShapes = array.map(deriveShape);
    throwInvariant(shapeEqual.apply(undefined, _toConsumableArray(childShapes)), "Input array is not a tensor");
    return [n].concat(_toConsumableArray(childShapes[0]));
  } else {
    return [0];
  }
}

function toArray(val) {
  return Array.isArray(val) ? val : [val];
}

function add(a, b) {
  return a + b;
}
function times(a, b) {
  return a * b;
}
function sum(nums) {
  return nums.reduce(add, 0);
}
function product(nums) {
  return nums.reduce(times, 1);
}