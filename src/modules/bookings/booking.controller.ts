import { Request, Response } from 'express';
import { bookingServices } from './booking.service';
import { vehicleServices } from '../vehicles/vehicle.services';
import { JwtPayload } from 'jsonwebtoken';

const createBooking = async (req: Request, res: Response) => {

    try {
        const vehicle = await vehicleServices.getVehicle(req.body.vehicle_id);
        const vehicleData = vehicle.rows?.[0]

        if (vehicle.rows.length && vehicleData?.availability_status === 'available') {
            const result = await bookingServices.createBooking(req.body, vehicleData);

            if (result.rows.length) {
                res.status(201).json({
                    success: true,
                    message: 'Booking Created successfully!',
                    data: result.rows[0]
                })
            }
        }

        res.status(500).json({
            success: false,
            message: 'Vehicle does not exist or not available!',
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingServices.getBookings(req.user as JwtPayload)

        if (result.rows.length) {
            res.status(201).json({
                success: true,
                message: 'Bookings fetched!',
                data: result.rows
            })
        }


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateBooking = async (req: Request, res: Response) => {
    const {bookingId} = req.params;
    const {status} = req.body;
    const user = req.user as JwtPayload;

    try {

        if (user.role === 'admin' && status !== 'returned') {
            throw new Error("You are only allowed to change status to returned!");
        }

        if (user.role === 'customer' && status !== 'cancelled') {
            throw new Error("You are only allowed to change status to cancelled!");
        }

        const result = await bookingServices.updateBooking(status, bookingId, user)

        if (!result) {
            throw new Error("failed to cancel booking!");
        }

        if (result.rows.length) {
            res.status(201).json({
                success: true,
                message: 'Booking cancelled!',
            })
        }


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const bookingControllers = {
    createBooking,
    getBookings,
    updateBooking
}