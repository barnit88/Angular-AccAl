# Stage 1: Build Angular apps and shared library
FROM node:18.12.1-alpine as builder

ARG sourceMap
# Deploy Environment [sandbox, production]
ARG denv 

WORKDIR /app

# Install Angular CLI globally
RUN npm install -g @angular/cli@15.2.1

# Copy package files for apps and library
COPY package*.json ./
COPY projects/shared/package*.json ./projects/shared/

# Install dependencies for apps and library
RUN npm install --productionn

# Copy source code for apps and library
COPY . .

# Build apps and library
RUN NODE_ENV=${denv} ng build shared
RUN ng build auth --source-map=${sourceMap}
RUN ng build dashboard --source-map=${sourceMap}


# Stage 2: Serve apps and library with Nginx
FROM nginx:alpine as production

# Remove default Nginx configuration files
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration file
COPY nginx/nginx.conf /etc/nginx/conf.d/

# Copy built apps and library from previous stage
COPY --from=builder /app/dist/shared /usr/share/nginx/html/shared
COPY --from=builder /app/dist/auth /usr/share/nginx/html/auth
COPY --from=builder /app/dist/dashboard /usr/share/nginx/html/dashboard

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]