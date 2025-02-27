FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p dist

RUN npm run build

ENV APP_PORT=3000


EXPOSE ${APP_PORT}

CMD ["npm", "run", "start"]
