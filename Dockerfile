# 1. Use a tiny, secure base image
FROM node:18-alpine

# 2. Create a specific folder for our app
WORKDIR /usr/src/app

# 3. Copy only the files we need
COPY package*.json ./
RUN npm install

COPY . .

# 4. SECURE PRACTICE: Create a non-root user
RUN adduser -D appuser
USER appuser

# 5. Open the port for the app
EXPOSE 3000

# 6. Start the app
CMD ["node", "app.js"]
