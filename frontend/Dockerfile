# Step 1: Build the frontend
FROM node:18 AS builder

WORKDIR /app
COPY . .

RUN npm install
RUN npm run build

# Step 2: Serve with nginx
FROM nginx:alpine

# Copy build output to nginx's web root
COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: overwrite default nginx config (skip if not needed)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
