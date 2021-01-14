FROM node:10
WORKDIR /user/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 3443
CMD ["npm", "start"]