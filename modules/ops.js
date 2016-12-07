import {
  _SHAPE_KEY,
  toArray,
  shape,
  isTensor,
  tensor,
  shapeEqual,
  sum,
  product,
  throwInvariant
} from './utils';

export function size(tensor) {
  return product(shape(tensor));
}

export function rank(tensor) {
  return shape(tensor).length;
}

export function unravelIndex(i, shape) {

  let size = product(shape);
  throwInvariant(i >= 0 && i < size, "Index out of range");

  if (shape.length < 2) {
    return i;
  }
 
  let ix = i;
  let index = [];
  for (let d=0; d<shape.length; d++) {
    size = size / shape[d];
    index.push( (ix / size) | 0 );
    ix = ix % size;
  }
  return index; 
}

export function reshape(t, newShape) {
  t = tensor(t);
  const tensorSize = size(t);
  newShape = _completeShape(newShape, tensorSize);

  throwInvariant(tensorSize === product(newShape),
    "Reshape tensor gets an incompatiable new shape");
  const flatArray = flatten(t);
  const output = _reshape1d(flatArray, newShape);
  output[_SHAPE_KEY] = newShape;
  return output;
}
export function flatten(t) {
  
  t = tensor(t);

  const s = shape(t);
  const tensorSize = size(t);
  const flatArray = new Array(tensorSize);
  for (let i=0; i<tensorSize; i++) {
    const index = unravelIndex(i, s);
    flatArray[i] = _getByIndex(t, index);
  }

  return flatArray;
}
export function transpose(t, axes) {
  throw Error("Not Implemented");
}
function _reshape1d(input, shape) {
  // TODO: get rid of recursion
  if (shape.length < 2) {
    return input;
  }
  const [d, ...rest] = shape;
  const newArray = [];
  const len = input.length;
  const k = len / d;
  for (let i=0; i<d; i++) {
    newArray.push(input.slice(i * k, i * k +k));
  }
  return newArray.map(a => _reshape1d(a, rest));
}

function _getByIndex(tensor, index) {
  index = toArray(index);
  let value = tensor;
  for (let i=0; i<index.length; i++) {
    value = value[index[i]];
  }
  return value;
}
function _completeShape(shape, size) {
  let j = -1, p = 1;
  for (let i=0; i<shape.length; i++) {
    if (shape[i] === -1) {
      throwInvariant(j < 0, "Cannot have more than one dimension=-1");
      j = i;
    } else {
      p = p * shape[i];
    }
  }
  if (j < 0) {
    return shape;
  } else {
    const newShape = [...shape];
    newShape[j] = size / p;
    return newShape;
  }
}
