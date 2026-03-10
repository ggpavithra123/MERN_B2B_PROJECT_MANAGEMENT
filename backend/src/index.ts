import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";

import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import "./config/passport.config";

import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import isAuthenticated from "./middlewares/isAuthenticated.middleware";

import { HTTPSTATUS } from "./config/http.config";
import { BadRequestException } from "./utils/appError";
import { ErrorCodeEnum } from "./enums/error-code.enum";

import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import workspaceRoutes from "./routes/workspace.route";
import memberRoutes from "./routes/member.route";
import projectRoutes from "./routes/project.route";
import taskRoutes from "./routes/task.route"; // ✅ Added task route

const app = express();
const BASE_PATH = config.BASE_PATH;   

/* --------------------------- Middleware --------------------------- */

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS (must be before session)
app.use(
  cors({
    origin: "https://mern-b2-b-teampro-qplw.vercel.app",
    credentials: true,
  })
);

// Session configuration
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: true,        // required for cross-site cookies
      httpOnly: true,
      sameSite: "none",    // required for Vercel ↔ Render
    },
  })
);

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());

/* ----------------------------- Routes ----------------------------- */

// Health / Test route
app.get(
  "/",
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    return res.status(HTTPSTATUS.OK).json({
      message: "Server running successfully 🚀",
    });
  })
);

// Auth routes
app.use(`${BASE_PATH}/auth`, authRoutes);

// Protected routes
app.use(`${BASE_PATH}/user`, isAuthenticated, userRoutes);
app.use(`${BASE_PATH}/workspace`, isAuthenticated, workspaceRoutes);
app.use(`${BASE_PATH}/member`, isAuthenticated, memberRoutes);
app.use(`${BASE_PATH}/project`, isAuthenticated, projectRoutes);
app.use(`${BASE_PATH}/task`, isAuthenticated, taskRoutes); // ✅ Task APIs

/* ------------------------- Error Handling ------------------------- */

app.use(errorHandler);

/* --------------------------- Server Start ------------------------- */

app.listen(config.PORT, async () => {
  console.log(
    `🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`
  );

  await connectDatabase();
});
