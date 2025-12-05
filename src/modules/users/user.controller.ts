import { Request, Response } from "express";
import { userServices } from "./user.service";

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers()

        res.status(201).json({
            success: true,
            message: 'all user fetched',
            data: result.rows
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }


}

export const userControllers = {
    getUsers,
}