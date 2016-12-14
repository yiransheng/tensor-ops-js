"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Thunk = function () {
    function Thunk(value) {
        _classCallCheck(this, Thunk);

        this.__value = value;
        this.__cache = { evaluated: false };
    }

    _createClass(Thunk, [{
        key: "valueOf",
        value: function valueOf() {
            if (!this.__cache.evaluated) {
                this.__cache = {
                    evaluated: true,
                    value: this.__value()
                };
            }
            return this.__cache.value;
        }
    }, {
        key: "map",
        value: function map(f) {
            var _this = this;

            return new Thunk(function () {
                return f(_this.valueOf());
            });
        }
    }, {
        key: "of",
        value: function of(val) {
            return Thunk.of(val);
        }
    }, {
        key: "flatMap",
        value: function flatMap(f) {
            var _this2 = this;

            return new Thunk(function () {
                return f(_this2.valueOf()).valueOf();
            });
        }
    }, {
        key: "flatten",
        value: function flatten() {
            return this.flatMap(function (x) {
                return x;
            });
        }
    }]);

    return Thunk;
}();

Thunk.of = function (val) {
    return new Thunk(function () {
        return val;
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports["default"] = Thunk;
//# sourceMappingURL=Thunk.js.map