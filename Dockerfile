# Step 1 build the project with npm

FROM node:17-alpine as build-step

WORKDIR /app

COPY ./package*.json /app/

RUN npm install

COPY . /app

RUN npm run build

# Step 2 run the server

FROM nginx:1.17.1-alpine

COPY --from=build-step /app/build /usr/share/nginx/html
COPY ./conf/default.conf /etc/nginx/conf.d/
