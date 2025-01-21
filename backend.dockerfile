FROM node:18-slim

WORKDIR /home/acadist

COPY src /home/acadist/src
COPY tsconfig.json /home/acadist/
COPY drizzle.config.ts /home/acadist/
COPY package.json /home/acadist/
COPY yarn.lock /home/acadist/

RUN mkdir /home/acadist/data
RUN mkdir /home/acadist/uploads

RUN yarn install --frozen-lockfile --network-timeout 600000
RUN yarn build

CMD ["yarn", "start"]