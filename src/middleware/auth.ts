import jwt, { JwtPayload } from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express"
import config from '../config';

const auth = (...roles: string[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({ message: "Please login to perform this action!" });
            }

            const token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({ message: 'Please login to perform this action!' })
            }

            const decoded = jwt.verify(token, config.jwt_secret as string) as JwtPayload;
            req.user = decoded;

            if (roles.length && !roles.includes(decoded.role as string)) {
                res.status(500).json({
                    error: "You are not allowed to perform this action!!",

                })
            }

            next()
        } catch (error: any) {
            res.status(500).json({
                message: error.message,
                success: false,
            })
        }
    }
}

export default auth;