# DevTinder-Backend

A Node.js & Express backend that powers DevTinder’s developer networking platform with secure authentication, real-time connections, and optimized database queries.

🔐 Authentication & Security
JWT-based authentication with HTTP-only cookies for secure session management.

Bcrypt password encryption to securely store user credentials.

MongoDB ObjectId validation to prevent injection attacks.

Role-based access control & middleware validation for enhanced security.

📡 Connection System
Send, update, or ignore connection requests with status-based tracking.

Duplicate request prevention and atomic status updates for data consistency.

Real-time connection status updates through event-driven architecture.

MongoDB ACID compliance ensures transactional integrity for connections.

📄 API Endpoints
Authentication

POST /auth/signup – Register a new user.

POST /auth/login – Authenticate and generate JWT.

POST /auth/logout – Clear session and revoke access.

Connection Requests

POST /request/send/:status/:toUserId – Send or update connection requests.

Status options: interested (request sent) | ignored (decline profile).

User Feed

GET /feed – Fetches recommended users, excluding the logged-in user, existing connections, and ignored profiles.

Pagination support: page (default: 1), limit (default: 10, max: 30).

Received Connection Requests

GET /user/requests/received – Retrieves pending connection requests.

Accepted Connections

GET /user/connections – Fetches all accepted connections.

🔍 Backend Logic & Validation
Feed Filtering: Excludes self, existing connections, and ignored users.

Database Query Optimization: Uses compound indexes and pagination for efficient data retrieval.

Validation Middleware: Ensures valid MongoDB ObjectIds, prevents duplicate requests, and secures API access.

🛠️ Tech Stack
Backend: Node.js, Express, MongoDB (Mongoose ORM).

Authentication: JWT, bcrypt password encryption.

Security: Input validation, authentication middleware, error handling.

Infrastructure: Hosted on AWS EC2, with Nginx reverse proxy for scalability.

This backend is designed for high security, scalability, and performance, implementing CS and system design principles for a seamless user experience.
