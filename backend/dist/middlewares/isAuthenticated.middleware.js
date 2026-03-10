"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const appError_1 = require("../utils/appError");
const isAuthenticated = (req, res, next) => {
    console.log("SESSION:", req.session);
    console.log("USER BEFORE:", req.user);
    // Hardcode user for debugging
    req.user = {
        _id: "69af85a56d3174f926a3e283" ,
    };
    console.log("USER AFTER:", req.user);
    if (!req.user || !req.user._id) {
        throw new appError_1.UnauthorizedException("Unauthorized. Please log in.");
    }
    next();
};
exports.default = isAuthenticated;
