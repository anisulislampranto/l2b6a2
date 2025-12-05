import express from "express"
import auth from "../../middleware/auth";
import { bookingControllers } from "./booking.controller";

const router = express.Router();

router.post('/', auth('admin', "customer"), bookingControllers.createBooking)
router.get('/', auth('admin', "customer"), bookingControllers.getBookings)

export const bookingRoutes = router;