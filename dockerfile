FROM node:10
COPY . /instagras-publication-ws
WORKDIR /instagras-publication-ws
RUN npm install
EXPOSE 3000
CMD [ "node", "api.js" ]