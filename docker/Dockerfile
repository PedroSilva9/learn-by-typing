FROM node:25-alpine

WORKDIR /home/node/app

# Copy package files for layer caching
COPY package*.json ./

# Copy and setup entrypoint
COPY docker/docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 5173

ENTRYPOINT ["docker-entrypoint.sh"]
