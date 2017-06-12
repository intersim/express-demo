// how do I run this file?
// npm - make package json with `npm init`
// make start script
// now, can run `node filename.js` and `npm start`

// Node docs: https://nodejs.org/api/http.html
var http = require('http');
var server = http.createServer();

server.on('request', function(request, response) {
  console.log('Got a request!', Object.keys(request));
  console.log('Here\'s a response', Object.keys(response));

  if (request.url == '/example' && request.method == 'GET') {
    response.writeHead(200, { "Content-Type": 'text/plain' });
    response.end('Here\'s a response for /example.');
  } else if (request.url == '/some-html' && request.method == 'GET') {
    response.writeHead(200, { "Content-Type": 'text/html' });
    response.end('<h1>Here\'s a response for /some-html.<h1>')
  } else {
    response.end('Here\'s a response for any other request.');
  }
});

server.listen(1337, function () {
  console.log('Listening on port 1337...')
});
