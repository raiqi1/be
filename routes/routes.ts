import { Router } from "express";
import { create_jadwal, get_jadwal } from "../controller/jadwal_controller";
import { create_user, login_user } from "../controller/user_controller";
import verifyToken from "../middleware";

const router = Router();

// Routes for User
router.post("/user", create_user);
router.post("/login", login_user);

// Routes for jadwal
router.post("/jadwal", verifyToken, create_jadwal);
router.get("/jadwal", verifyToken, get_jadwal);

export default router;
