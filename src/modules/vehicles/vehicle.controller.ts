import { Request, Response } from "express";
import { vehicleServices } from "./vehicle.services";
import { JwtPayload } from "jsonwebtoken";

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

const getVehicle = async (req: Request, res: Response) => {
    const {vehicleId} = req.params;

    try {
        const result = await vehicleServices.getVehicle(vehicleId)

        res.status(200).json({
            success: true,
            message: 'Fetched vehicle!',
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const updateVehicle = async (req: Request, res: Response) => {
    const {vehicleId} = req.params;

    try {
        const result = await vehicleServices.updateVehicle(vehicleId, req.body)

        res.status(200).json({
            success: true,
            message: 'Updated vehicle!',
            data: result.rows[0],
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const deleteVehicle = async (req: Request, res: Response) => {
    const { vehicleId } = req.params;
    const { role } = req.user as JwtPayload;
    try {

        if (String(role) === 'admin') {
            const result = await vehicleServices.deleteVehicle(vehicleId)

            if (!result) {
                res.status(201).json({
                    success: false,
                    message: 'Vehicle has active booking',
                })
            }

            res.status(201).json({
                success: true,
                message: 'Vehicle Deleted',
                data: result?.rows
            })

        } else {
            res.status(500).json({
                success: false,
                message: 'You are not allowed update this user!',
            })
        }


    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const vehicleControllers = {
    addVehicle,
    getVehicles,
    getVehicle,
    updateVehicle,
    deleteVehicle
}