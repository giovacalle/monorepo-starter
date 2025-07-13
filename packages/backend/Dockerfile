FROM alpine:latest

ARG PB_VERSION=0.28.4

RUN apk add --no-cache \
    unzip \
    ca-certificates \
    nodejs \
    npm

ADD https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip /tmp/pb.zip
RUN unzip /tmp/pb.zip -d /pb/

COPY ./package.json /pb/package.json
WORKDIR /pb
RUN npm install --production

COPY ./entrypoint.sh /pb/entrypoint.sh
RUN chmod +x /pb/entrypoint.sh

COPY ./pb_migrations /pb/pb_migrations
COPY ./pb_hooks /pb/pb_hooks

EXPOSE 8080

CMD ["/pb/entrypoint.sh"]
