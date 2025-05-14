FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 80
HEALTHCHECK CMD curl --fail http://localhost || exit 1
CMD ["nginx", "-g", "daemon off;"]