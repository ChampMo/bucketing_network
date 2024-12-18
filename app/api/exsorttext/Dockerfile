# Use the official Node.js image as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if present)
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port that your app will listen on
EXPOSE 3000

# Run the Node.js application
CMD ["node", "exsorttext.js"]
