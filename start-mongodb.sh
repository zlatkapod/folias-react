#!/bin/bash

echo "Starting MongoDB container for Folias app..."
docker-compose up -d

echo "Waiting for MongoDB to initialize..."
sleep 5

echo "MongoDB is now running!"
echo "- MongoDB is available at mongodb://localhost:27017"
echo "- Mongo Express UI is available at http://localhost:8081"
echo ""
echo "To connect in your application, use the connection string:"
echo "mongodb://folias_admin:folias_password@localhost:27017/folias?authSource=admin"
echo ""
echo "To stop the containers, run: docker-compose down" 