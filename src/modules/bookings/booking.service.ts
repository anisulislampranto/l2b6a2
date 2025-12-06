import { JwtPayload } from "jsonwebtoken";
import { pool } from "../../config/db"


const createBooking = async (payload: Record<string, unknown>, vehicleData: Record<string, unknown>) => {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date, status } = payload;;
    const {id, vehicle_name, type, registration_number, daily_rent_price} = vehicleData;

    const start = new Date(String(rent_start_date).replace(/-/g, "/"));
    const end = new Date(String(rent_end_date).replace(/-/g, "/"));

    const diffMs = end.getTime() - start.getTime();
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

    const total_price = Number(daily_rent_price) * days;

    const result = await pool.query(`INSERT INTO Bookings(customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status) VALUES($1, $2, $3, $4, $5, $6) RETURNING *`, [customer_id, vehicle_id, rent_start_date, rent_end_date, total_price, status])
    
    await pool.query(`UPDATE Vehicles SET vehicle_name=$1, type=$2, registration_number=$3, daily_rent_price=$4, availability_status=$5 WHERE id=$6 RETURNING *`, [vehicle_name, type, registration_number, daily_rent_price, 'booked', id])

    return result
}

const getBookings = async(user: JwtPayload) => {
    let bookings;

    if (user.role === 'admin') {
        const allBookings = await pool.query(`SELECT * FROM Bookings`)
        bookings = allBookings;
    } else {
        const userBookings = await pool.query(`SELECT * FROM Bookings WHERE customer_id=$1`, [user.id])
        bookings = userBookings;
    }

    return bookings;
}

const updateBooking = async(status: string, bookingId: string | undefined, user: JwtPayload) => {
    const booking = await pool.query(`SELECT * FROM Bookings WHERE id=$1`, [bookingId])
    const bookingData = booking.rows[0]

    if (!bookingData) {
        throw Error('Booking not found')
    }

    if (user.role === 'admin') {
        const updatedBooking = await pool.query( `UPDATE Bookings SET status=$1 WHERE id=$2 RETURNING *`,  [status, bookingId]);
        await pool.query( `UPDATE Vehicles SET availability_status=$1 WHERE id=$2`, ["available", bookingData.vehicle_id]);

        return updatedBooking;
    } else if(user.role === 'customer') {

        if (String(bookingData.customer_id) !== String(user.id)) {
            throw Error('You can only update your own Bookings!');
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startDate = new Date(bookingData.rent_start_date);
        startDate.setHours(0, 0, 0, 0);

        if (startDate > today) {
            const updatedBooking = await pool.query(`UPDATE Bookings SET status=$1 WHERE id=$2 RETURNING *`, [status, bookingId]);
            await pool.query(`UPDATE Vehicles SET availability_status=$1 WHERE id=$2`, ["available", bookingData.vehicle_id]);
            return updatedBooking;
        }

    }

    
}

export const bookingServices = {
    createBooking,
    getBookings,
    updateBooking
}