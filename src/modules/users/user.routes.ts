import express from "express"
import { userControllers } from "./user.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/', auth('admin'), userControllers.getUsers)
router.put('/:userId', auth('admin', "customer"), userControllers.updateUser)


export const userRoutes = router;