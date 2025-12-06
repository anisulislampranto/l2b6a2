import bcrypt from 'bcryptjs';
import { pool } from "../../config/db"
import jwt from 'jsonwebtoken'
import config from '../../config';

const signin = async (email: string, password: string) => {
    const result = await pool.query(`SELECT * FROM Users WHERE email=$1`, [email])

    console.log('user', result);

    if (result?.rows?.length === 0) {
        return null
    }

    const user = result.rows?.[0];

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        return null
    }

    const token = jwt.sign({id: user.id, name: user.name, email: user.email, role: user.role }, config.jwt_secret as string, { expiresIn: '7d' })

    console.log('user', user);
    console.log('token', token);

    return { token, user };
}

const signup = async (payload: Record<string, unknown>) => {
    const { name, email, password, phone } = payload;
    let userRole;
    const hashedPass = await bcrypt.hash(password as string, 10);
    
    const users  = await pool.query(`SELECT * FROM Users`);

    if (users?.rows?.length === 0) {
        userRole = 'admin'
    } else {
        userRole = 'customer'
    }

    const result = await pool.query(`INSERT INTO Users(name, role, email, password, phone) VALUES($1, $2, $3, $4, $5) RETURNING *`, [name, userRole, email, hashedPass, phone])
    

    const user = result.rows?.[0];

    const token = jwt.sign({id: user.id, name: user?.name, email: user?.email, role: user?.role }, config.jwt_secret as string, { expiresIn: '7d' })

    return {
        token,
        user
    };
}

export const authServices = {
    signin,
    signup
}