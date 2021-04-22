const http = require("http");
const app = require("./app");
const port = process.env.PORT || 8080;

const server = http.createServer(app.application);
server.listen(port);
