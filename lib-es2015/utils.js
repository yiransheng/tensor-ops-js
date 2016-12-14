"use strict";
function throwInvariant(condition, message) {
    if (!condition) {
        throw Error(message);
    }
}
exports.throwInvariant = throwInvariant;
function shapeEqual(...shapes) {
    if (shapes.length < 2) {
        return true;
    }
    let last = shapes.pop() || [];
    while (shapes.length) {
        if (!_shapeEqual(last, shapes.pop() || []))
            return false;
    }
    return true;
}
exports.shapeEqual = shapeEqual;
function _shapeEqual(a, b) {
    const checkArray = Array.isArray(a) && Array.isArray(b) && a.length === b.length;
    if (checkArray) {
        const len = a.length;
        for (let i = 0; i < len; i++) {
            if (a[i] !== b[i])
                return false;
        }
        return true;
    }
    else {
        return false;
    }
}
function deriveShape(array) {
    if (!Array.isArray(array)) {
        return []; // a scalar
    }
    const n = array.length;
    if (n > 0) {
        const childShapes = array.map(deriveShape);
        throwInvariant(shapeEqual(...childShapes), "Input array is not a tensor");
        return [n, ...childShapes[0]];
    }
    else {
        return [0];
    }
}
exports.deriveShape = deriveShape;
function computeStrides(shape) {
    const len = shape.length;
    const strides = new Array(len);
    let step = 1;
    for (let i = 0; i < len; i++) {
        strides[len - i - 1] = step;
        step *= shape[len - i - 1];
    }
    return strides;
}
exports.computeStrides = computeStrides;
function flattenArray(a) {
    const output = [];
    const queue = [a];
    while (queue.length) {
        const array = queue.shift() || [];
        for (const item of array) {
            if (Array.isArray(item)) {
                queue.push(item);
            }
            else {
                output.push(item);
            }
        }
    }
    return output;
}
exports.flattenArray = flattenArray;
function slice1d(array, start, len, stride) {
    if (!stride || stride === 1) {
        return array.slice(start, start + len);
    }
    else if (stride > 0) {
        const output = [];
        const end = start + len * stride;
        for (let i = start; i < end; i += stride) {
            output.push(array[i]);
        }
        return output;
    }
    throw Error("Invalid Stride for slice1d");
}
exports.slice1d = slice1d;
function range(start, end, step = 1) {
    throwInvariant(step > 0 || step < 0, "(range), step needs to be a number, and cannot be 0");
    throwInvariant((end >= start) === (step > 0), "Infinite loop detected");
    const output = [];
    const f = step < 0 ? -1 : 1;
    for (let i = start; (f * i) < (f * end); i += step) {
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