FROM registry.access.redhat.com/ubi8/nodejs-16


# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app/
run npm install --development
run npm run build 

EXPOSE 4200
EXPOSE 49153

CMD npm run start
