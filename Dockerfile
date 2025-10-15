FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies with cache optimization
RUN npm ci --production=false --frozen-lockfile

# Copy source code
COPY . .

# Remove frontend directory to avoid conflicts
RUN rm -rf frontend/

# Build the application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
