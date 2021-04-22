function requestHandler(request, response) {
  const url = request.url;
  const method = request.method;
  if (url === "/auth/" && method === "POST") {
    const body = [];
    request.on("data", (chunk) => {
      body.push(chunk);
    });
    request.on("end", () => {
      const parsedRequest = Buffer.concat(body).toString();
      console.log(parsedRequest);
      response.write(parsedRequest);
      response.end();
    });
  } else {
    response.setHeader("Content-Type", "text/html");
    response.write("<html>");
    response.write("<head><title>Lubo Test Server</title></head>");
    response.write("<body><h1>This is Blank Page</h1></body>");
    response.write("</html>");
    response.end();
  }
}

module.exports = {
  handler: requestHandler,
};
