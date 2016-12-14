export interface Monad<T> {

  flatMap<U>(f: (t: T) => Monad<U>): Monad<U>;

  of<U>(t: U): Monad<U>;

}
export interface Functor<T> {

  map<U>(f: (t: T) => U): Functor<U>;

}

interface Evaluated<T> {
  evaluated: true,
  value : T
}
interface Unevaluated<T> {
  evaluated: false
}

export default class Thunk<T> implements Functor<T>, Monad<T> {

  private __value: ()=>T;
  private __cache: Evaluated<T> | Unevaluated<T>;

  static of = function <T>(val: T): Thunk<T> {
    return new Thunk(() => val);
  }

  constructor(value: ()=>T) {
    this.__value = value;
    this.__cache = { evaluated:false };
  }
  valueOf(): T {
    if (!this.__cache.evaluated) {
      this.__cache = {
        evaluated : true,
        value : this.__value()
      };
    }
    return this.__cache.value;
  }
  map<U>(f: (t: T)=>U) {
    return new Thunk(() => {
      return f(this.valueOf());
    });
  }
  of<T>(val: T) {
    return Thunk.of(val);
  }
  flatMap<U>(f: (t: T)=>Thunk<U>) {
    return new Thunk(() => {
      return f(this.valueOf()).valueOf();
    })
  }
  flatten() {
    return this.flatMap(<T>(x: T) => x)
  }
}