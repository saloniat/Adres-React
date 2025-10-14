FROM node:22-alpine
 
RUN npm install -g yarn --force
 
WORKDIR /app
 
COPY package.json yarn.lock ./
 
RUN yarn install
 
COPY . .
 
RUN yarn build-css
 
CMD ["npm", "start"]
