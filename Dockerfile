# Stage 1: Build Angular App
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build --configuration=production
 
# Stage 2: Serve Angular App with Nginx
FROM nginx:alpine
COPY --from=build /app/dist/publisher-portal/browser /usr/share/nginx/html

# Copy the custom Nginx configuration
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
 
# Copy the environment script
# COPY ./docker/env-config.sh /usr/share/nginx/html/env-config.sh
# RUN chmod +x /usr/share/nginx/html/env-config.sh
 
# Set the environment variable (optional, can be set at runtime)
# ENV API_URL="http://localhost:8089/"
 
# Run the environment config script before starting Nginx
CMD ["nginx", "-g", "daemon off;"]
# CMD ["/bin/sh", "-c", "/usr/share/nginx/html/env-config.sh && nginx -g 'daemon off;'"]
