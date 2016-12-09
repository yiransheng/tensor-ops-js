const UNEVALUATED = Symbol();

class Thunk {
  constructor(value) {
    this.__value = value;
    this.__cache = UNEVALUATED;
  }
  valueOf() {
    if (this.__cache === UNEVALUATED) {
      this.__cache = this.__value();
    }
    return this.__cache;
  }
  map(f) {
    return new Thunk(() => {
      return f(this.valueOf());
    });
  }
  flatten() {
    return this.valueOf().valueOf();
  }
  flatMap(f) {
    return this.map(f).flatten();
  }
  ap(thunk) {
    return thunk.flatMap(val => {
      return this.flatMap(f => f(val));
    });
  }
}
Thunk.of = (val) => new Thunk(() => val);

export default Thunk;
