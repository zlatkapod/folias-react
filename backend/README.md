# Folias Backend API

Backend API for the Folias plant management application.

## Features

- Complete REST API with Express.js
- MongoDB database with Mongoose ODM
- User authentication with JWT
- CRUD operations for plants, care logs, and rooms
- Advanced filtering, sorting, and pagination
- Image upload for plants and health issues
- Intelligent reminders based on plant care schedules

## Getting Started

### Prerequisites

- Node.js (v14+)
- MongoDB (local instance or MongoDB Atlas)

### Installation

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure environment variables:

Create a `.env` file in the backend directory with the following variables:

```
PORT=8000
MONGODB_URI=mongodb://localhost:27017/folias
JWT_SECRET=your_jwt_secret_key_change_this_in_production
NODE_ENV=development
```

Replace the `MONGODB_URI` with your own MongoDB connection string if needed.

### Development

Start the development server:

```bash
npm run dev
```

This will start the server with nodemon, which will automatically restart when you make changes.

### Production

For production, start the server with:

```bash
npm start
```

## API Endpoints

### Authentication

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login and get JWT token
- `GET /api/users/me` - Get current user data
- `PATCH /api/users/updateMe` - Update current user profile
- `PATCH /api/users/updatePassword` - Update current user password

### Plants

- `GET /api/plants` - Get all plants for current user
- `POST /api/plants` - Create a new plant
- `GET /api/plants/:id` - Get a specific plant
- `PATCH /api/plants/:id` - Update a plant
- `DELETE /api/plants/:id` - Delete a plant
- `GET /api/plants/to-water` - Get plants due for watering
- `GET /api/plants/by-room/:room` - Get plants by room
- `GET /api/plants/by-health/:status` - Get plants by health status

### Care Logs

- `POST /api/care-logs` - Create a new care log
- `GET /api/care-logs/:id` - Get a specific care log
- `PATCH /api/care-logs/:id` - Update a care log
- `DELETE /api/care-logs/:id` - Delete a care log
- `GET /api/care-logs/plant/:plantId` - Get all care logs for a plant
- `GET /api/care-logs/type/:type` - Get care logs by type
- `GET /api/care-logs/recent` - Get recent care logs

### Rooms

- `GET /api/rooms` - Get all rooms for current user
- `POST /api/rooms` - Create a new room
- `GET /api/rooms/:id` - Get a specific room with its plants
- `PATCH /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room (only if it has no plants)

## Data Models

### User

- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, min length 8)
- `role`: String (default: 'user')
- `avatar`: String

### Plant

- `name`: String (required)
- `type`: String
- `room`: String (required)
- `lightCondition`: String (enum)
- `wateringFrequency`: String (enum)
- `nextWatering`: Date
- `lastWatered`: Date
- `potSize`: String
- `soilType`: String
- `health`: String (enum: ['Good', 'Needs Attention'])
- `acquiredDate`: Date
- `imageUrl`: String
- `notes`: String
- `owner`: ObjectId (reference to User)

### CareLog

- `plant`: ObjectId (reference to Plant)
- `type`: String (enum: ['watering', 'fertilizing', 'repotting', 'health'])
- `date`: Date
- `quantity`: Number (for watering/fertilizing)
- `fertilizerName`: String (for fertilizing)
- `potSize`: String (for repotting)
- `soilType`: String (for repotting)
- `issue`: String (for health issues)
- `description`: String (for health issues)
- `treatment`: String (for health issues)
- `photoUrl`: String (for health issues)
- `notes`: String
- `createdBy`: ObjectId (reference to User)

### Room

- `name`: String (required)
- `lightCondition`: String (enum)
- `description`: String
- `imageUrl`: String
- `owner`: ObjectId (reference to User)

## Contributing

Feel free to submit issues and enhancement requests.

## License

[MIT](LICENSE) 