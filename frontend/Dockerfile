# Step 1: Use Node.js 18 as base image
FROM node:20-alpine

# Step 2: Set working directory inside container
WORKDIR /app

# Step 3: Copy package.json first (for caching)
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy rest of the project files
COPY . .

# Step 6: Expose port 5173 (Vite default port)
EXPOSE 5173

# Step 7: Start the app
CMD ["npm", "run", "dev", "--", "--host"]