"use strict";

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function throwInvariant(condition, message) {
    if (!condition) {
        throw Error(message);
    }
}
exports.throwInvariant = throwInvariant;
function shapeEqual() {
    for (var _len = arguments.length, shapes = Array(_len), _key = 0; _key < _len; _key++) {
        shapes[_key] = arguments[_key];
    }

    if (shapes.length < 2) {
        return true;
    }
    var last = shapes.pop() || [];
    while (shapes.length) {
        if (!_shapeEqual(last, shapes.pop() || [])) return false;
    }
    return true;
}
exports.shapeEqual = shapeEqual;
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
exports.deriveShape = deriveShape;
function computeStrides(shape) {
    var len = shape.length;
    var strides = new Array(len);
    var step = 1;
    for (var i = 0; i < len; i++) {
        strides[len - i - 1] = step;
        step *= shape[len - i - 1];
    }
    return strides;
}
exports.computeStrides = computeStrides;
function flattenArray(a) {
    var output = [];
    var queue = [a];
    while (queue.length) {
        var array = queue.shift() || [];
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = array[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var item = _step.value;

                if (Array.isArray(item)) {
                    queue.push(item);
                } else {
                    output.push(item);
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator["return"]) {
                    _iterator["return"]();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
    }
    return output;
}
exports.flattenArray = flattenArray;
function slice1d(array, start, len, stride) {
    if (!stride || stride === 1) {
        return array.slice(start, start + len);
    } else if (stride > 0) {
        var output = [];
        var end = start + len * stride;
        for (var i = start; i < end; i += stride) {
            output.push(array[i]);
        }
        return output;
    }
    throw Error("Invalid Stride for slice1d");
}
exports.slice1d = slice1d;
function range(start, end) {
    var step = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 1;

    throwInvariant(step > 0 || step < 0, "(range), step needs to be a number, and cannot be 0");
    throwInvariant(end >= start === step > 0, "Infinite loop detected");
    var output = [];
    var f = step < 0 ? -1 : 1;
    for (var i = start; f * i < f * end; i += step) {
        output.push(i);
    }
    return output;
}
exports.range = range;
function add(a, b) {
    return a + b;
}
exports.add = add;
function times(a, b) {
    return a * b;
}
exports.times = times;
function sum(nums) {
    return nums.reduce(add, 0);
}
exports.sum = sum;
function product(nums) {
    return nums.reduce(times, 1);
}
exports.product = product;
//# sourceMappingURL=utils.js.map