# Folias - Plant Management App

Folias is a complete plant management application designed to help you keep track of your plant collection, their care requirements, and health status.

## Project Structure

This is a full-stack application with the following structure:

```
folias-react/
├── src/               # React frontend source code
├── public/            # Static assets for the frontend
├── backend/           # Node.js + Express + MongoDB API
└── ... other files    # Configuration, package.json, etc.
```

## Features

- 🌱 Plant inventory management
- 🏡 Room-based organization
- 💧 Care logging (watering, fertilizing, repotting, health issues)
- 📊 Plant health tracking
- 📅 Watering reminders
- 📱 Responsive design for both desktop and mobile

## Getting Started

### Prerequisites

- Node.js (v14+)
- Docker and Docker Compose (for MongoDB)
- npm or yarn

### MongoDB Setup with Docker

This project uses MongoDB running in Docker containers:

1. Start the MongoDB containers:

```bash
./start-mongodb.sh
```

This will:
- Start MongoDB in a Docker container
- Start Mongo Express (web UI for MongoDB) at http://localhost:8081
- Create a persistent volume for your data

2. Access the MongoDB admin interface:
   - Open http://localhost:8081 in your browser
   - Login credentials are in the docker-compose.yml file

To stop the MongoDB containers:

```bash
docker-compose down
```

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
npm install
```

3. Start the backend development server:

```bash
npm run dev
```

The API will be available at http://localhost:8000

### Frontend Setup

1. From the project root, install frontend dependencies:

```bash
npm install
```

2. Start the frontend development server:

```bash
npm run dev
```

The frontend will be available at http://localhost:5173

## API Documentation

See the [backend README](backend/README.md) for detailed API documentation.

## Development Roadmap

- [x] Basic plant tracking
- [x] Care logging
- [x] Room management
- [ ] Plant recognition
- [ ] Offline support
- [ ] Plant marketplace
- [ ] Social sharing
- [ ] Mobile app using React Native

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
