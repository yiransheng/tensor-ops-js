export interface DeepArray<T> extends Array<T | DeepArray<T>> { }
export type Shape = number[];

export function throwInvariant(condition:boolean, message:string): void {
  if(!condition) {
    throw Error(message);
  }
}

export function shapeEqual(...shapes:Shape[]):boolean {
  if (shapes.length < 2) {
    return true;
  }
  let last = shapes.pop() || [];
  while (shapes.length) {
    if (!_shapeEqual(last, shapes.pop() || [])) return false;
  }
  return true;
}
function _shapeEqual(a:Shape, b:Shape) {
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

export function deriveShape(array:DeepArray<any>): Shape {
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

export function computeStrides(shape: Shape): Shape {
  const len = shape.length;
  const strides = new Array(len);
  let step = 1;
  for (let i=0; i<len; i++) {
    strides[len - i - 1] = step;
    step *= shape[len - i - 1];
  }
  return strides;
}

export function flattenArray<T>(a: DeepArray<T>):T[] {
  const output:T[] = [];
  const queue = [a];
  while (queue.length) {
    const array = queue.shift() || [];
    for (const item of array) {
      if (Array.isArray(item)) {
        queue.push(item);
      } else {
        output.push(item);
      }
    }
  }
  return output;
}
export function slice1d<T>(array:T[], start:number, len:number, stride:number): T[] {
  if (!stride || stride === 1) {
    return array.slice(start, start + len);
  } else if (stride > 0) {
    const output:T[] = [];
    const end = start + len * stride;
    for (let i=start; i < end; i += stride) {
      output.push(array[i]);
    }
    return output;
  }
  throw Error("Invalid Stride for slice1d");
}

export function range(start:number, end:number, step:number=1):number[] {
  throwInvariant(step > 0 || step < 0, 
      "(range), step needs to be a number, and cannot be 0");
  throwInvariant((end >= start) === (step > 0), "Infinite loop detected");
  const output:number[] = [];
  const f = step < 0 ? -1 : 1;
  for (let i=start; (f * i) < (f * end); i+=step) {
    output.push(i);
  }
  return output;
}

export function add(a:number, b:number):number {
  return a + b;
}
export function times(a:number, b:number):number {
  return a * b;
}
export function sum(nums:number[]):number {
  return nums.reduce(add, 0);
}
export function product(nums:number[]):number {
  return nums.reduce(times, 1);
}
