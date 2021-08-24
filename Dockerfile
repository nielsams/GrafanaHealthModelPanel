FROM node:16 as builder
WORKDIR /usr/src/app/
COPY . .
RUN ["yarn", "build"]

FROM grafana/grafana:latest
ENV GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS="nielsb-healthmodeltree"
WORKDIR /var/lib/grafana/plugins/healthmodeltree/
COPY --from=builder /usr/src/app/dist* ./dist
