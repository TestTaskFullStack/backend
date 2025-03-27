import express from "express";
import { adminBoard, allAccess, userBoard } from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";
 
const router = express.Router();
 
// Public route
router.get("/all", allAccess);
 
// User route (any authenticated user)
router.get("/user", [authJwt.verifyToken], userBoard);
 

// Admin route
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);
 
export default router;