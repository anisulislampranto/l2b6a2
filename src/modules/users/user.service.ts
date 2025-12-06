import { pool } from "../../config/db"
import bcrypt from 'bcryptjs';


const getUsers = async () => {
    const result = await pool.query(`SELECT * FROM Users`)
    return result;
}

const updateUser = async (id: string | undefined, payload: Record<string, unknown>) => {
    const { name, email, password, role, phone } = payload;

    const hashedPass = await bcrypt.hash(password as string, 10);

    const result = await pool.query(`UPDATE Users SET name=$1, email=$2, password=$3, role=$4, phone=$5 WHERE id=$6 RETURNING *`, [name, email, hashedPass, role, phone, id])
    return result
}

const deleteUser = async (id: string | undefined) => {
    const bookings = await pool.query(`SELECT id FROM Bookings WHERE customer_id=$1`,[id]);

    if (bookings.rows.length > 0) {
        return null; 
    }

    const result = await pool.query(`DELETE FROM Users WHERE id=$1 RETURNING *`, [id]);

    return result;
};

export const userServices = {
    getUsers,
    updateUser,
    deleteUser
}