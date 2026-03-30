FROM node:20
WORKDIR /usr/src/app
COPY package*.json ./
RUN apt-get update && apt-get install -y openssl
RUN npm install
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"]
