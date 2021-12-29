# Use a standard node image as the build container
FROM node:16 as builder

# Copy the files into the builder container
WORKDIR /usr/src/app
COPY . .

# Build the healthmodel panel project
WORKDIR /usr/src/app/healthmodelpanel
RUN ["yarn", "build"]

# Build phase is done, now build the container. Start with latest Grafana image
FROM grafana/grafana:latest

# Load custom plugin that we built in the first stage
# Since our plugin is unsigned, we have to specify it by name to allow it to run
ENV GF_PLUGINS_ALLOW_LOADING_UNSIGNED_PLUGINS="healthmodelpanel"
WORKDIR /var/lib/grafana/plugins/healthmodelpanel/
COPY --from=builder /usr/src/app/healthmodelpanel/dist* ./dist

# Copy config. Since we want our edited copy (containing the inserted queries), we copy this from the builder container too.
COPY --from=builder /usr/src/app/config/grafana.ini /etc/grafana
COPY --from=builder /usr/src/app/config/provisioning /etc/grafana/provisioning

# Open port 3000 for Grafana. We'll tell AppService to redirect there.
EXPOSE 3000/tcp
