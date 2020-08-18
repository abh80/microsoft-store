"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.get = void 0;
const axios_1 = require("axios");
exports.get = async (url) => {
    const { data: res } = await axios_1.default.get(url);
    return res;
};
//# sourceMappingURL=requester.js.map