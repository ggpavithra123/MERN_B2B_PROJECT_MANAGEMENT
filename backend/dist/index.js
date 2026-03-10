"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const app_config_1 = require("./config/app.config");
const database_config_1 = __importDefault(require("./config/database.config"));
require("./config/passport.config");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const asyncHandler_middleware_1 = require("./middlewares/asyncHandler.middleware");
const isAuthenticated_middleware_1 = __importDefault(require("./middlewares/isAuthenticated.middleware"));
const http_config_1 = require("./config/http.config");
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const workspace_route_1 = __importDefault(require("./routes/workspace.route"));
const member_route_1 = __importDefault(require("./routes/member.route"));
const project_route_1 = __importDefault(require("./routes/project.route"));
const task_route_1 = __importDefault(require("./routes/task.route")); // ✅ Added task route
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const app = (0, express_1.default)();
const BASE_PATH = "/api";
//const BASE_PATH = config.BASE_PATH;   
/* --------------------------- Middleware --------------------------- */
// Body parser
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS (must be before session)
app.use((0, cors_1.default)({
    origin: "https://mern-b2-b-teampro-qplw.vercel.app",
    credentials: true,
}));
/* ✅ ADD THIS LINE HERE */
app.set("trust proxy", 1);
app.use((0, express_session_1.default)({
    secret: app_config_1.config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: connect_mongo_1.default.create({
        mongoUrl: app_config_1.config.MONGO_URI,
        collectionName: "sessions",
    }),
    cookie: {
        secure: true,
        sameSite: "none",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
    },
}));
// Passport authentication
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
/* ----------------------------- Routes ----------------------------- */
// Health / Test route
app.get("/", (0, asyncHandler_middleware_1.asyncHandler)(async (req, res, next) => {
    return res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Server running successfully 🚀",
    });
}));
// Auth routes
app.use(`${BASE_PATH}/auth`, auth_route_1.default);
// Protected routes
app.use(`${BASE_PATH}/user`, isAuthenticated_middleware_1.default, user_route_1.default);
app.use(`${BASE_PATH}/workspace`, isAuthenticated_middleware_1.default, workspace_route_1.default);
app.use(`${BASE_PATH}/member`, isAuthenticated_middleware_1.default, member_route_1.default);
app.use(`${BASE_PATH}/project`, isAuthenticated_middleware_1.default, project_route_1.default);
app.use(`${BASE_PATH}/task`, isAuthenticated_middleware_1.default, task_route_1.default); // ✅ Task APIs
/* ------------------------- Error Handling ------------------------- */
app.use(errorHandler_middleware_1.errorHandler);
/* --------------------------- Server Start ------------------------- */
app.listen(app_config_1.config.PORT, async () => {
    console.log(`🚀 Server running on port ${app_config_1.config.PORT} in ${app_config_1.config.NODE_ENV} mode`);
    await (0, database_config_1.default)();
});
