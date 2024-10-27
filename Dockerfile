# Use the official Node.js 14 image as the base
FROM node:14

# Set the working directory inside the container
WORKDIR /app

# Copy the package.json and package-lock.json files to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire source code to the working directory inside the container
COPY . .

# Expose port 3000 to allow external access
EXPOSE 3000

# Command to run when the container starts
CMD ["node", "src/app.js"]
