import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";

const addVehicle = async (req: Request, res: Response) => {

    try {
        const result = await vehicleServices.addVehicle(req.body)

        res.status(201).json({
            success: true,
            message: 'Vehicle added!',
            data: result.rows[0]
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehicleServices.getVehicles()

        res.status(200).json({
            success: true,
            message: 'Fetched all vehicles!',
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const vehicleControllers = {
    addVehicle,
    getVehicles
}