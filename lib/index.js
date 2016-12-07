'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _utils = require('./utils');

Object.defineProperty(exports, 'shape', {
  enumerable: true,
  get: function get() {
    return _utils.shape;
  }
});
Object.defineProperty(exports, 'isTensor', {
  enumerable: true,
  get: function get() {
    return _utils.isTensor;
  }
});
Object.defineProperty(exports, 'tensor', {
  enumerable: true,
  get: function get() {
    return _utils.tensor;
  }
});
Object.defineProperty(exports, 'shapeEqual', {
  enumerable: true,
  get: function get() {
    return _utils.shapeEqual;
  }
});
Object.defineProperty(exports, 'sum', {
  enumerable: true,
  get: function get() {
    return _utils.sum;
  }
});
Object.defineProperty(exports, 'product', {
  enumerable: true,
  get: function get() {
    return _utils.product;
  }
});

var _ops = require('./ops');

Object.keys(_ops).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function get() {
      return _ops[key];
    }
  });
});