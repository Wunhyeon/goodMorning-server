# FROM node:18.14.0

# WORKDIR /app

# COPY package.json ./

# RUN npm install --force

# RUN npm install --global pm2 

# COPY ./ ./

# # nest build
# RUN npm run build

# # RUN ls

# # pm2-runtime 으로 실행
# CMD [  "pm2-runtime", "start", "ecosystem.config.js","--env","production" ]
# # CMD ["npm", "start"]
# # CMD ["ls"]
# # CMD ["sh"]

# # ENTRYPOINT ["/bin/sh", "-c", "/bin/bash"]

FROM node:18.15.0-alpine As development

WORKDIR /usr/src/app
# WORKDIR /app

COPY package*.json ./

RUN npm install --force --only=development
# RUN npm install --force 

COPY . .

RUN npm run build

FROM node:18.15.0-alpine as production

ARG NODE_ENV=prod
ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app
# WORKDIR /app

COPY package*.json ./

RUN npm install --force --only=production
# RUN npm install --force

COPY . .

RUN npm install --global pm2 

COPY --from=development /usr/src/app/dist ./dist
# COPY --from=development /app/dist ./dist

# EXPOSE 8080

# CMD ["node", "dist/src/main.js"]
CMD [  "pm2-runtime", "start", "ecosystem.config.js","--env","production" ]