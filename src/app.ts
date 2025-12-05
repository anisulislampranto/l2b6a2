import express, { Request, Response } from 'express'
import initDB from './config/db';
import { authRoutes } from './modules/auth/auth.routes';
import { vehicleRoutes } from './modules/vehicles/vehicles.routes';
import { userRoutes } from './modules/users/user.routes';
import { bookingRoutes } from './modules/bookings/booking.route';

const app = express()

// int db
initDB()

// parser
app.use(express.json())

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!')
})

// auth routes 
app.use('/api/v1/auth', authRoutes)

// vehicles routes 
app.use('/api/v1/vehicles', vehicleRoutes)

// users routes
app.use('/api/v1/users', userRoutes)

// bookings routes
app.use('/api/v1/bookings', bookingRoutes)

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.path
    })
})

export default app;