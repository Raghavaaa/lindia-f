#!/bin/bash
echo "Starting deployment process..."
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo "Installing dependencies..."
npm install
echo "Building application..."
npm run build
echo "Build completed successfully!"
echo "Starting application..."
npm start
