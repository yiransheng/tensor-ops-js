export const _SHAPE_KEY = Symbol("shape");

export function throwInvariant(condition, message) {
  if(!condition) {
    throw Error(message);
  }
}

export function isTensor(t) {
  return Array.isArray(t) && t[_SHAPE_KEY];
}

export function shape(t) {
  return isTensor(t) ? t[_SHAPE_KEY] : deriveShape(t); 
}

export function shapeEqual(...shapes) {
  if (shapes.length < 2) {
    return true;
  }
  let last = shapes.pop();
  while (shapes.length) {
    if (!_shapeEqual(last, shapes.pop())) return false;
  }
  return true;
}
function _shapeEqual(a, b) {
  const checkArray = Array.isArray(a) && Array.isArray(b) && a.length === b.length;
  if (checkArray) {
    const len = a.length;
    for (let i=0; i<len; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  } else {
    return false;
  }
}

export function tensor(array) {
  if (isTensor(array)) {
    return array;
  } else if (Array.isArray(array)) {
    array[_SHAPE_KEY] = deriveShape(array);
    return array;
  }

  throwInvariant(false, "Tensors can be only made from arrays");
}

export function deriveShape(array) {
  if (!Array.isArray(array)) {
    return []; // a scalar
  }
  const n = array.length;   
  if (n > 0) {
    const childShapes = array.map(deriveShape);
    throwInvariant(shapeEqual(...childShapes), "Input array is not a tensor");
    return [n, ...childShapes[0]] 
  } else {
    return [0];
  }
}

export function computeStrides(shape) {
  const len = shape.length;
  const strides = new Array(len);
  let step = 1;
  for (let i=0; i<len; i++) {
    strides[len - i - 1] = step;
    step *= shape[len - i - 1];
  }
  return strides;
}

export function toArray(val) {
  return Array.isArray(val) ? val : [val];
}


export function add(a, b) {
  return a + b;
}
export function times(a, b) {
  return a * b;
}
export function sum(nums) {
  return nums.reduce(add, 0);
}
export function product(nums) {
  return nums.reduce(times, 1);
}
