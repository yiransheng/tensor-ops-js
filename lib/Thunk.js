"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var UNEVALUATED = Symbol();

var Thunk = function () {
  function Thunk(value) {
    _classCallCheck(this, Thunk);

    this.__value = value;
    this.__cache = UNEVALUATED;
  }

  _createClass(Thunk, [{
    key: "valueOf",
    value: function valueOf() {
      if (this.__cache === UNEVALUATED) {
        this.__cache = this.__value();
      }
      return this.__cache;
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
    key: "flatten",
    value: function flatten() {
      return this.valueOf().valueOf();
    }
  }, {
    key: "flatMap",
    value: function flatMap(f) {
      return this.map(f).flatten();
    }
  }, {
    key: "ap",
    value: function ap(thunk) {
      var _this2 = this;

      return thunk.flatMap(function (val) {
        return _this2.flatMap(function (f) {
          return f(val);
        });
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

exports["default"] = Thunk;