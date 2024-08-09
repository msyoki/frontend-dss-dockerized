FROM node:18

WORKDIR /app

# Copy .env and package files to the working directory
COPY .env .env
COPY package.json .
COPY package-lock.json .

# Install dependencies
RUN npm install

# Copy the rest of the project files to the working directory
COPY src/ ./src/
COPY public/ ./public/

# Build the React app
RUN npm run build

# Install serve to serve the build files
RUN npm install -g serve

# Expose port
EXPOSE 3000

# Serve the build files
CMD ["serve", "-s", "build"]
