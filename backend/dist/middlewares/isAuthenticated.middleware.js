"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isAuthenticated = (req, res, next) => {
    req.user = { _id: "69af85a56d3174f926a3e283" };
    next();
};
exports.default = isAuthenticated;
