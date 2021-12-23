FROM node:16-alpine as base

RUN apk --no-cache add curl
WORKDIR /src
COPY package*.json /
EXPOSE 3001

FROM base as production
ENV NODE_ENV=production
RUN npm ci
COPY . /

FROM base as dev
ENV NODE_ENV=development
RUN npm install -g nodemon && npm install
COPY . /