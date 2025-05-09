FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Default command (overridable in docker-compose)
CMD ["npm", "start"]