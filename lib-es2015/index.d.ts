import { Shape, DeepArray } from './utils';
import Tensor from './Tensor';
export declare function tensor<T>(array: DeepArray<T>): Tensor<T>;
export declare function reshape<T>(array: DeepArray<T>, shape: Shape): DeepArray<T>;
export declare function transpose<T>(array: DeepArray<T>, dims?: Shape): DeepArray<T>;
export default Tensor;
