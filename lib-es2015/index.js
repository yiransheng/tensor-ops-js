"use strict";
const utils_1 = require("./utils");
const Thunk_1 = require("./Thunk");
const Tensor_1 = require("./Tensor");
function tensor(array) {
    const thunk = new Thunk_1.default(() => {
        return utils_1.flattenArray(array);
    });
    return new Tensor_1.default(thunk, utils_1.deriveShape(array));
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
exports.default = Tensor_1.default;
//# sourceMappingURL=index.js.map