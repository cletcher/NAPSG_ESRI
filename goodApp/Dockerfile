### Dashboard ###
### STAGE 1: Build ###
# Using 'builder' as an alias for clarity
FROM node:9-alpine as builder
RUN mkdir /esri-dash/

COPY MutualAid/ /esri-dash/
RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
WORKDIR /esri-dash/

RUN npm i --no-optional
COPY . .
##RUN $(npm bin)/ng build --dev --build-optimizer --aot --base-href /dashboard/ --no-sourcemap

### STAGE 2: Setup Server ###
FROM httpd:2.4-alpine
COPY ./httpd.conf /usr/local/apache2/conf/httpd.conf
COPY ./server.crt /usr/local/apache2/conf/server.crt
COPY ./server.key /usr/local/apache2/conf/server.key
COPY ./test/index.html /usr/local/apache2/htdocs/
COPY --from=builder /esri-dash/ /usr/local/apache2/htdocs/dashboard/
EXPOSE 80
EXPOSE 443
