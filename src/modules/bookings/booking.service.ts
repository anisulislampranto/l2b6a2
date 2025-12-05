import { pool } from "../../config/db"


const createBooking = async (payload: Record<string, unknown>, vehicleData: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;;
    const {id, vehicle_name, type, registration_number, daily_rent_price} = vehicleData;

    const start = new Date(String(rent_start_date).replace(/-/g, "/"));
    const end = new Date(String(rent_end_date).replace(/-/g, "/"));

    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const total_price = Number(daily_rent_price) * days;

    const result = await pool.query(`INSERT INTO bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status])
    
    const updatedVehicle = await pool.query(`UPDATE vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, 'booked', id])

    return result
}

export const bookingServices = {
    createBooking
}