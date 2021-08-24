FROM ubuntu:latest as builder
WORKDIR /app/
COPY . .
RUN yarn install


FROM grafana:latest
#RUN yarn build
#COPY ./dist/* /var/lib/grafana/plugins/healthmodeltree

ENV GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS="nielsb-healthmodeltree"
WORKDIR /grafana/lib/plugins/healthmodeltree/
COPY --from=builder /app/* .