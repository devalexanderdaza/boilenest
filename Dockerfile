/*
Copyright (c) 2022, Alexander Daza - Boilenest

Hippocratic + Do Not Harm (H-DNH) Version 1.1

Most software today is developed with little to no thought of how it will
be used, or the consequences for our society and planet.
As software developers, we engineer the infrastructure of the 21st century.
We recognise that our infrastructure has great power to shape the world and the lives of those we share it with,
and we choose to consciously take responsibility for the social and environmental impacts of what we build.

    https://github.com/devalexanderdaza/boilenest#license
*/
FROM node:17-alpine as base
WORKDIR /usr/src/boilenest
ENV NODE_ENV=production PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
COPY package.json yarn.lock ./
RUN yarn install --production --pure-lockfile && \
    yarn cache clean

FROM base as build
WORKDIR /usr/src/boilenest
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
COPY package.json yarn.lock ./
RUN yarn install --production=false --pure-lockfile && \
    yarn cache clean
COPY . .
RUN yarn prebuild && yarn build


FROM base
WORKDIR /usr/src/boilenest/
ENV NODE_ENV=production
RUN yarn cache clean
COPY . .
COPY --from=dist /usr/src/boilenest/ /usr/src/wpp-server/
EXPOSE 3000
ENTRYPOINT ["node", "dist/main"]
