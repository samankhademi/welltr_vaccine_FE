FROM node:14.17.0 as builder

ENV NODE_ENV production

WORKDIR /home/website

COPY . .

RUN yarn install --production=false && yarn run build

# config nginx
FROM nginx:latest
WORKDIR /usr/share/nginx/html/
RUN rm -f *

COPY --from=builder /home/website/build/ /usr/share/nginx/html/website/

COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose ports
EXPOSE 8080
