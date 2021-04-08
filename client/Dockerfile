FROM node:14.7-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
COPY . ./
EXPOSE 3000
CMD ["npm", "start"]