import { Request, Response } from 'express';
import { authServices } from './auth.service';

const signin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        const result = await authServices.signin(email, password);

        if (!result) {
            res.status(200).json({
                success: false,
                message: 'Email or password is wrong!',
            })
        }

        res.status(200).json({
            success: true,
            message: 'User Logged in Successfully',
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const signup = async (req: Request, res: Response) => {
    try {
        const result = await authServices.signup(req.body)

        res.status(201).json({
            success: true,
            message: 'data inserted',
            data: result
        })

    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export const authControllers = {
    signin,
    signup
}