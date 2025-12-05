import { Pool } from "pg"
import config from "."

export const pool = new Pool({
    connectionString: config.connection_str
})

const initDB = async () => {
    await pool.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(150) UNIQUE NOT NULL CHECK (email = LOWER(email)),
            password VARCHAR(255) NOT NULL CHECK (char_length(password) >= 6),
            role VARCHAR(50) NOT NULL,
            phone VARCHAR(15),
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
        )
    `)

    await pool.query(`
        CREATE TABLE IF NOT EXISTS vehicles (
            id SERIAL PRIMARY KEY,
            vehicle_name VARCHAR(100) NOT NULL,
            type VARCHAR(20) NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
            registration_number VARCHAR(150) UNIQUE NOT NULL,
            daily_rent_price NUMERIC NOT NULL CHECK (daily_rent_price > 0),
            availability_status VARCHAR(20) NOT NULL CHECK (availability_status IN ('available', 'booked'))
        )
    `)

}

export default initDB;