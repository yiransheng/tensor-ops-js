"use strict";

var utils_1 = require("./utils");
var Thunk_1 = require("./Thunk");
var Tensor_1 = require("./Tensor");
function tensor(array) {
    var thunk = new Thunk_1["default"](function () {
        return utils_1.flattenArray(array);
    });
    return new Tensor_1["default"](thunk, utils_1.deriveShape(array));
}
exports.tensor = tensor;
function reshape(array, shape) {
    return tensor(array).reshape(shape).tolist();
}
exports.reshape = reshape;
function transpose(array, dims) {
    return tensor(array).transpose(dims).tolist();
}
exports.transpose = transpose;
Object.defineProperty(exports, "__esModule", { value: true });
exports["default"] = Tensor_1["default"];
//# sourceMappingURL=index.js.map