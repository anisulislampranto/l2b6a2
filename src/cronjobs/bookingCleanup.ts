import cron from "node-cron";
import { pool } from "../config/db";

export const startBookingCleanupJob = () => {
    cron.schedule(
        "0 0 * * *", 
        async () => {
            const client = await pool.connect();
            try {
                const expired = await client.query(`SELECT id, vehicle_id FROM Bookings WHERE rent_end_date < CURRENT_DATE AND status <> 'returned'` );

                if (expired.rowCount === 0) {
                    return;
                }

                const bookingIds = expired.rows.map((b: any) => b.id);
                const vehicleIds = [...new Set(expired.rows.map((b: any) => b.vehicle_id))];

                await client.query( `UPDATE Bookings SET status = 'returned' WHERE id = ANY($1::int[])`, [bookingIds]);

                await client.query(`UPDATE Vehicles SET availability_status = 'available' WHERE id = ANY($1::int[])`, [vehicleIds]);

            } catch (err) {
                console.error("failed to do scheduled job", err);
            }
        },
        {
            timezone: "Asia/Dhaka",
        }
    );
};
