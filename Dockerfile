# Dockerfile

# base image
FROM node:alpine

ARG port
ARG nextPubApi
ARG nextSsrApi
ARG mongoUrl
ARG mongoDbName
ARG siteUrl
ARG jwtSecretKey
ARG aliMailKey
ARG aliMailSecret
ARG aliMailFrom

ENV PORT=${port}
ENV NEXT_PUBLIC_API_END_POINT=${nextPubApi}
ENV NEXT_PUBLIC_SSR_API_END_POINT=${nextSsrApi}
ENV MONGO_URL=${mongoUrl}
ENV MONGO_DB_COMMON_NAME=${mongoDbName}
ENV SITE_URL=${siteUrl}
ENV JWT_SECRET_KEY=${jwtSecretKey}
ENV ALI_MAIL_KEY=${aliMailKey}
ENV ALI_MAIL_SECRET=${aliMailSecret}
ENV ALI_MAIL_FROM=${aliMailFrom}

# install Python
#RUN apk add g++ make python
ENV PYTHONUNBUFFERED=1
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools
RUN apk add g++ make

# create & set working directory
RUN mkdir -p /usr/src
WORKDIR /usr/src

# copy source files
COPY . /usr/src

# install dependencies
RUN yarn install

WORKDIR /usr/src/packages/next

RUN yarn build

CMD yarn run start
