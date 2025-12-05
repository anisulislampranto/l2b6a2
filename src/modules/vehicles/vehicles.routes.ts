import express from "express"
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post('/', auth('admin'), vehicleControllers.addVehicle)


export const vehicleRoutes = router;