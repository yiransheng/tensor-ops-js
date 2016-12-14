import { Shape, DeepArray } from './utils';
import Thunk from './Thunk';
declare class Tensor<T> {
    readonly _array: Thunk<T[]>;
    readonly _shape: Shape;
    readonly _strides: Shape;
    constructor(array: Tensor<T> | Thunk<T[]> | DeepArray<T>, shape: Shape, strides?: Shape);
    tolist(): DeepArray<T>;
    toArray(): DeepArray<T>;
    flatten(): Tensor<T>;
    reshape(newShape: Shape): Tensor<T>;
    slice(start: Shape, size: Shape): Tensor<T>;
    transpose(dims?: Shape): Tensor<T>;
    reduceAlongAxis<U>(axis: number, func: (a: U, b: T) => U, zero: U): Tensor<U>;
    _getArray(): Thunk<T[]>;
    _isTransposed(): boolean;
}
export default Tensor;
