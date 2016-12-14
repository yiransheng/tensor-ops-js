export interface DeepArray<T> extends Array<T | DeepArray<T>> {
}
export declare type Shape = number[];
export declare function throwInvariant(condition: boolean, message: string): void;
export declare function shapeEqual(...shapes: Shape[]): boolean;
export declare function deriveShape(array: DeepArray<any>): Shape;
export declare function computeStrides(shape: Shape): Shape;
export declare function flattenArray<T>(a: DeepArray<T>): T[];
export declare function slice1d<T>(array: T[], start: number, len: number, stride: number): T[];
export declare function range(start: number, end: number, step?: number): number[];
export declare function add(a: number, b: number): number;
export declare function times(a: number, b: number): number;
export declare function sum(nums: number[]): number;
export declare function product(nums: number[]): number;
