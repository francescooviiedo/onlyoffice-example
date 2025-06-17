FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3055

CMD ["npx", "nodemon", "server.js"]
