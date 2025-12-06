import { Request, Response } from "express";
import { userServices } from "./user.service";
import { JwtPayload } from "jsonwebtoken";

const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await userServices.getUsers()

        res.status(200).json({
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

            res.status(200).json({
                success: true,
                message: 'User Updated',
                data: result.rows
            })
        } else {
            res.status(403).json({
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

const deleteUser = async (req: Request, res: Response) => {
    const {userId} = req.params;
    const {role} = req.user as JwtPayload;
    try {

        if (String(role) === 'admin') {
            const result = await userServices.deleteUser(userId)

            if (!result) {
                res.status(403).json({
                    success: false,
                    message: 'Cannot Delete User with active booking!',
                })
            }

            res.status(200).json({
                success: true,
                message: 'User deleted',
                data: result?.rows
            })
        } else {
            res.status(500).json({
                success: false,
                message: 'You are not allowed delete this user!',
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
    updateUser,
    deleteUser
}