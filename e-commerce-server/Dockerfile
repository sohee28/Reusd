FROM node:14.7-alpine
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
RUN npm install react-scripts -g --silent
COPY . ./
CMD ["npm", "start"]