import express from "express"
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/', auth('admin'), userControllers.getUsers)


export const userRoutes = router;