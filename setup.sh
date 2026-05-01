#!/bin/bash

# Project Management App Setup Script
echo "🚀 Setting up Project Management App..."

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install
cd ..

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "To start the development environment:"
echo "1. Backend: cd backend && npm start (or npm run dev)"
echo "2. Frontend: cd frontend && npm run dev"
echo ""
echo "Don't forget to:"
echo "1. Create .env file in backend folder"
echo "2. Add MONGODB_URI and JWT_SECRET"
echo "3. See .env.example for reference"
