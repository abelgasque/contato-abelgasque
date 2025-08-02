FROM node:23-alpine AS build

WORKDIR /app
RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install --force

COPY . .

RUN ng build --configuration=production

FROM nginx:alpine AS runtime
EXPOSE 80
COPY --from=build /app/dist /usr/share/nginx/html