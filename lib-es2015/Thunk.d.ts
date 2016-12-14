export interface Monad<T> {
    flatMap<U>(f: (t: T) => Monad<U>): Monad<U>;
    of<U>(t: U): Monad<U>;
}
export interface Functor<T> {
    map<U>(f: (t: T) => U): Functor<U>;
}
export default class Thunk<T> implements Functor<T>, Monad<T> {
    private __value;
    private __cache;
    static of: <T>(val: T) => Thunk<T>;
    constructor(value: () => T);
    valueOf(): T;
    map<U>(f: (t: T) => U): Thunk<U>;
    of<T>(val: T): Thunk<T>;
    flatMap<U>(f: (t: T) => Thunk<U>): Thunk<U>;
    flatten(): Thunk<{}>;
}
