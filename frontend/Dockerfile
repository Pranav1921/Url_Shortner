# Build Stage
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Set environment variables so Vite bakes them into the production build
ENV VITE_API_URL=http://localhost:5000
ENV VITE_SHORTEN_ENDPOINT=/api/shorten

RUN npm run build

# Serve Stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]