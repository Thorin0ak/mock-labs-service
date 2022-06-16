FROM node:16 As development

WORKDIR /app

COPY package*.json .

# RUN npm config set registry https://artifacts.co.ihc.com/repomgr/repository/npm-all
RUN npm install --only=development

COPY . .

RUN npm run build

FROM node:16-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /app

COPY package*.json .

# RUN npm config set registry https://artifacts.co.ihc.com/repomgr/repository/npm-all
RUN npm install --only=production

COPY . .

COPY --from=development /app/dist ./dist

ENV TS_NODE_PROJECT=./tsconfig.run.json
CMD ["node", "dist/main"]
