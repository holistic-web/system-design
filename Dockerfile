# See https://codeship.com/documentation/docker/browser-testing/
FROM selenium/node-chrome

VOLUME [ "/" ]

RUN node app