"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.size = size;
exports.rank = rank;
exports.unravelIndex = unravelIndex;
exports.reshape = reshape;
exports.flatten = flatten;
exports.transpose = transpose;

var _utils = require("./utils");

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); }

function size(tensor) {
  return (0, _utils.product)((0, _utils.shape)(tensor));
}

function rank(tensor) {
  return (0, _utils.shape)(tensor).length;
}

function unravelIndex(i, shape) {

  var size = (0, _utils.product)(shape);
  (0, _utils.throwInvariant)(i >= 0 && i < size, "Index out of range");

  if (shape.length < 2) {
    return i;
  }

  var ix = i;
  var index = [];
  for (var d = 0; d < shape.length; d++) {
    size = size / shape[d];
    index.push(ix / size | 0);
    ix = ix % size;
  }
  return index;
}

function reshape(t, newShape) {
  t = (0, _utils.tensor)(t);
  var tensorSize = size(t);
  newShape = _completeShape(newShape, tensorSize);

  (0, _utils.throwInvariant)(tensorSize === (0, _utils.product)(newShape), "Reshape tensor gets an incompatiable new shape");
  var flatArray = flatten(t);
  var output = _reshape1d(flatArray, newShape);
  output[_utils._SHAPE_KEY] = newShape;
  return output;
}
function flatten(t) {

  t = (0, _utils.tensor)(t);

  var s = (0, _utils.shape)(t);
  var tensorSize = size(t);
  var flatArray = new Array(tensorSize);
  for (var i = 0; i < tensorSize; i++) {
    var index = unravelIndex(i, s);
    flatArray[i] = _getByIndex(t, index);
  }

  return flatArray;
}
function transpose(t, axes) {
  throw Error("Not Implemented");
}
function _reshape1d(input, shape) {
  // TODO: get rid of recursion
  if (shape.length < 2) {
    return input;
  }

  var _shape = _toArray(shape),
      d = _shape[0],
      rest = _shape.slice(1);

  var newArray = [];
  var len = input.length;
  var k = len / d;
  for (var i = 0; i < d; i++) {
    newArray.push(input.slice(i * k, i * k + k));
  }
  return newArray.map(function (a) {
    return _reshape1d(a, rest);
  });
}

function _getByIndex(tensor, index) {
  index = (0, _utils.toArray)(index);
  var value = tensor;
  for (var i = 0; i < index.length; i++) {
    value = value[index[i]];
  }
  return value;
}
function _completeShape(shape, size) {
  var j = -1,
      p = 1;
  for (var i = 0; i < shape.length; i++) {
    if (shape[i] === -1) {
      (0, _utils.throwInvariant)(j < 0, "Cannot have more than one dimension=-1");
      j = i;
    } else {
      p = p * shape[i];
    }
  }
  if (j < 0) {
    return shape;
  } else {
    var newShape = [].concat(_toConsumableArray(shape));
    newShape[j] = size / p;
    return newShape;
  }
}