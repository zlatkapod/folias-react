# Folias - Plant Care Application

Folias is a comprehensive plant care application that helps you manage and track your houseplants. The application allows you to add plants, track their care, manage rooms, and configure plant-related settings.

## Features

- **Plant Management**: Add, edit, and delete plants with detailed information
- **Room Management**: Organize plants by rooms with different light conditions
- **Care Tracking**: Log watering and other care activities
- **Configuration**: Customize plant types, soil types, pot sizes, and light conditions
- **Blog**: Share and read plant care tips and experiences

## Tech Stack

### Frontend
- React
- Vite
- Axios for API communication
- CSS for styling

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/folias-react.git
cd folias-react
```

2. Install frontend dependencies
```bash
npm install
```

3. Install backend dependencies
```bash
cd backend
npm install
```

4. Set up environment variables
   - Create a `.env` file in the backend directory
   - Add the following variables:
   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/folias
   NODE_ENV=development
   ```

5. Seed the database with initial data
```bash
cd backend
npm run seed
```

6. Start the backend server
```bash
npm run dev
```

7. In a new terminal, start the frontend development server
```bash
cd ..
npm run dev
```

8. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
folias-react/
├── src/                  # Frontend source code
│   ├── components/       # React components
│   ├── services/         # API services
│   ├── App.jsx           # Main application component
│   └── main.jsx          # Entry point
├── backend/              # Backend source code
│   ├── src/              # Backend source files
│   │   ├── controllers/  # API controllers
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   ├── middleware/   # Custom middleware
│   │   ├── utils/        # Utility functions
│   │   └── server.js     # Server entry point
│   └── .env              # Environment variables
└── README.md             # Project documentation
```

## API Endpoints

### Plants
- `GET /api/plants` - Get all plants
- `GET /api/plants/:id` - Get a specific plant
- `POST /api/plants` - Create a new plant
- `PUT /api/plants/:id` - Update a plant
- `DELETE /api/plants/:id` - Delete a plant

### Rooms
- `GET /api/rooms` - Get all rooms
- `GET /api/rooms/:id` - Get a specific room
- `POST /api/rooms` - Create a new room
- `PUT /api/rooms/:id` - Update a room
- `DELETE /api/rooms/:id` - Delete a room

### Configuration
- `GET /api/config/plant-types` - Get all plant types
- `POST /api/config/plant-types` - Create a new plant type
- `PUT /api/config/plant-types/:id` - Update a plant type
- `DELETE /api/config/plant-types/:id` - Delete a plant type
- Similar endpoints for soil-types, pot-sizes, and light-conditions

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- Plant care information sourced from various botanical resources
- Icons and design inspiration from various open-source projects
