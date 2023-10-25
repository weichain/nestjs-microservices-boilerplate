# Base image
FROM node:16-alpine

# Create app directory
WORKDIR /app

# Bundle app source
COPY . .

# Required when running the container
ENV NODE_ENV=development

# Install build dependencies and build
RUN npm install -g pnpm && \
    pnpm i && \
    pnpm build

# Create a non-root user
RUN adduser -D appuser

# Change the ownership of the /app directory to the non-root user
RUN chown -R appuser /app
# Make it executable
RUN chmod +x /app/entrypoint.sh

# Expose the port
EXPOSE 3000

# Set the user and entry point
USER appuser
ENTRYPOINT ["/app/entrypoint.sh"]
