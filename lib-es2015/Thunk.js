"use strict";
class Thunk {
    constructor(value) {
        this.__value = value;
        this.__cache = { evaluated: false };
    }
    valueOf() {
        if (!this.__cache.evaluated) {
            this.__cache = {
                evaluated: true,
                value: this.__value()
            };
        }
        return this.__cache.value;
    }
    map(f) {
        return new Thunk(() => {
            return f(this.valueOf());
        });
    }
    of(val) {
        return Thunk.of(val);
    }
    flatMap(f) {
        return new Thunk(() => {
            return f(this.valueOf()).valueOf();
        });
    }
    flatten() {
        return this.flatMap((x) => x);
    }
}
Thunk.of = function (val) {
    return new Thunk(() => val);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Thunk;
//# sourceMappingURL=Thunk.js.map