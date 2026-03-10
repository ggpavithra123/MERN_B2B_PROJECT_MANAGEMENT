"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUserController = void 0;
const asyncHandler_middleware_1 = require("../middlewares/asyncHandler.middleware");
const http_config_1 = require("../config/http.config");
const user_service_1 = require("../services/user.service");
exports.getCurrentUserController = (0, asyncHandler_middleware_1.asyncHandler)(async (req, res) => {
    const userId = "69af85a56d3174f926a3e283";
    const { user } = await (0, user_service_1.getCurrentUserService)(userId);
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "User fetch successfully",
        user,
    });
});
