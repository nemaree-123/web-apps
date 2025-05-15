# Use Nginx as the base image
FROM nginx:alpine

# Copy website content to Nginx's web directory
COPY . /usr/share/nginx/html

# Expose port 80
EXPOSE 80
