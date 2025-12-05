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

}

export default initDB;