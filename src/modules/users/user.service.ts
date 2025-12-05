import { pool } from "../../config/db"
import bcrypt from 'bcryptjs';


const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM users`)
    return result;
}

const updateUser = async (id: string | undefined, payload: Record<string, unknown>) => {
    const { name, email, password, role, phone } = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`UPDATE users SET name=$1, email=$2, password=$3, role=$4, phone=$5 WHERE id=$6 RETURNING *`, [name, email, hashedPass, role, phone, id])
    return result
}

export const userServices = {
    getUsers,
    updateUser
}