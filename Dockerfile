FROM node:alpine

# Create app directory
WORKDIR /usr/src/app

# If you are building your code for production
# RUN npm install --only=production

# Bundle app source
COPY . .

EXPOSE 1337
CMD [ "npm", "start" ]