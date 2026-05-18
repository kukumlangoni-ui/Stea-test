FROM node:22-slim

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps

COPY . .
RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
