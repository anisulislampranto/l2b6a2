import express from "express"
import { vehicleControllers } from "./vehicle.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.get('/',  vehicleControllers.getVehicles)
router.post('/', auth('admin'), vehicleControllers.addVehicle)
router.get('/:vehicleId',  vehicleControllers.getVehicle)
router.put('/:vehicleId', auth('admin'),  vehicleControllers.updateVehicle)


export const vehicleRoutes = router;