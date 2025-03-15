#!/bin/bash

echo "Setting up Folias Backend..."

# Installing dependencies
echo "Installing dependencies..."
npm install

# Check if MongoDB is running locally
echo "Checking MongoDB status..."
mongo --eval "db.stats()" >/dev/null 2>&1
if [ $? -eq 0 ]; then
  echo "MongoDB is running."
else
  echo "Warning: MongoDB does not appear to be running locally."
  echo "Make sure you have MongoDB installed and running, or update your .env file to use MongoDB Atlas."
fi

# Check if .env file exists, create if not
if [ ! -f .env ]; then
  echo "Creating .env file..."
  echo "PORT=8000" > .env
  echo "MONGODB_URI=mongodb://localhost:27017/folias" >> .env
  echo "JWT_SECRET=temporary_jwt_secret_change_in_production" >> .env
  echo "NODE_ENV=development" >> .env
  echo ".env file created. Please update it with your settings."
else
  echo ".env file already exists."
fi

echo "Setup complete! You can start the backend with 'npm run dev'" 