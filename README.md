##Car booking Service - `https://l2b6a2.vercel.app/`

##Technology Stack:
Node.js + TypeScript
Express.js (web framework)
PostgreSQL (database)
bcrypt (password hashing)
jsonwebtoken (JWT authentication)

##Features: 
Anyone can	Register new user account
Anyone can	Login 

Admin only can	Add new vehicle. 
Anyone can	View all vehicles.
Anyone can	View specific vehicle details.
Admin only can	Update vehicle details.
Admin only can	Delete vehicle (only if no active bookings exist).

Admin only can	View all users in the system.
Admin only can Update any user's role or details.
Customer can Update own profile only.
Admin only can Delete user (only if no active bookings exist).


Customer or Admin can	Create booking with start/end dates
• Validates vehicle availability
• Calculates total price (daily rate × duration)
• Updates vehicle status to "booked"

Admin can View all bookings.
Customer can View own bookings only.


Customer can cancel booking (before start date only).
Admin can Mark as "returned" (updates vehicle to "available").
Cron job will auto-mark as "returned" when the period ends.


