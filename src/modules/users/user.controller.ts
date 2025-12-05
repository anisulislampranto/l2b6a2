import { Request, Response } from "express";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

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

const updateUser = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {id, role} = req.user as JwtPayload;
    try {

        if (String(role) === 'admin' || String(id) === String(userId)) {
            const result = await userServices.updateUser(userId, req.body)

            res.status(201).json({
                success: true,
                message: 'User Updated',
                data: result.rows
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

export const userControllers = {
    getUsers,
    updateUser
}