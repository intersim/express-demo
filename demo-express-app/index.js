// npm init -y: answers yes to all init prompts
// npm install --save express

/*
* A server listens on a port
* A server won't handle requests unless you tell it to do so
*/
var express = require('express');

var app = express();

app.listen(1337, function() {
  console.log('Listening on port 1337...')
});

// Express methods: register a callback function that will handle a certain type of request
// if you don't send a response, the client will just keep waiting
app.get('/example', function (request, response) {
  console.log(Object.keys(request));
  // response.send('Hello!');
  // response.send('<h1 style="background-color: turquoise;">Hello!</h1>')
  // response.send({ // or response.json
  //   name: "Emily",
  //   favoriteColor: "turquoise"
  // });
});

// make request to /; ask students why that gets an error back
// make request to /example; why is that hanging?
// make command line request: curl http://localhost:1337/example

// The browser (or at least, Chrome) only makes GET requests from URL bar; how to make POST or PUT? Try curl, or Postman; and later, we'll learn other ways too.
// curl localhost:1337/example
app.get('/example', function(request, response){
  response.send("You made a GET request!");
});

// You can specify methods other than GET when using curl with '-X METHOD':
// curl http://localhost:1337/example -X POST
app.post('/example', function(request, response){
  response.send("You made a POST request!");
});

app.put('/example', function(request, response){
  response.send("You made a PUT request!");
});

// Routes are NOT filepaths; routes are strings that you get to specify
app.get('/example.html', function(request, response){
  response.send("I am not a file.");
});

app.get('/example', function(request, response){
  response.sendFile(__dirname + '/example.html');
});

/***** A simple CR app (Create/Read) ****/
var cats = [];

app.post('/cats', function(request, response){
  var cat = Math.random() > 0.5 ? cat = '😺' : cat = '😿';
  cats.push(cat);
  response.json(cats);
});

// app.get('/cats', function(request, response){
//   response.json(cats);
// });

/***** Request Query vs. Params vs Body ****/

// We define the route as /times2, but when requests are made, there's an extra "query string" added to the end of that URL, e.g. "/times2?num=6"
app.get('/times2', function(request, response){
  response.json(2 * request.query.num);
});

// req.params example
app.get('/times2/:num', function(request, response){
  response.json(2 * request.params.num);
});

app.get('/multiplication/:num1/:num2', function(request, response){
  var product = request.params.num1 * request.params.num2;
  response.json(product);
});

// you won't have `request.body` unless you use `bodyParser`
var bodyParser = require('body-parser');
app.use(bodyParser.json());

// payload of request, `request.body`
// to make a POST request with a body using curl:
// curl localhost:1337/times2 -X POST -H "Content-Type: application/json" -d '{"num": 14}'
app.post('/times2', function (request, response) {
  var result = request.body.num * 2;
  response.json(result);
});

/***** Middleware ****/

// Middleware: an extra step that happens in between input (request) and output (response)

// next: forwards on to the next match route handler
app.get('/something', function(request, response, next) {
  // response.send("Firstly!") // can't set headers after they are sent, i.e. can't send more than one response
  console.log('Firstly!'); // this will show up in our server's console
  next(); // You must either call next or send a response in your route handlers
});

app.get('/something', function(request, response, next){
  response.send('Finally!');
});

// You can attach custom properties to the request object, so you can use that property in subsequent matching routes:
app.get('/cats', function(request, response, next){
  // console.log(request.query);

  var filteredCats = cats;
  if (request.query.emotion == 'happy') {
    filteredCats = cats.filter(cat => cat === '😺');
  } else if (request.query.emotion == 'sad') {
    filteredCats = cats.filter(cat => cat === '😿')
  }

  request.filteredCats = filteredCats;
  console.log("User has requested " + request.query.emotion + " cats.");
  next();
});

app.get("/cats", function(request, response){
  response.json(request.filteredCats);
});

// This middleware matches all verbs and URIs, including partial URI-matching, because it's defined using `app.use`
app.use(function(request, response, next){
  console.log("I always run")
  next();
});

app.all(function(request, response, next){
  console.log("I run for all requests to /")
  next();
});

app.get('/something', function(request, response, next) {
  response.send('Finally!');
});

// Error-handling example:
app.get('/roulette', function(request, response, next){
  if (Math.random() > 0.5) {
    var err = new Error('You lost Error Roulette.');
    err.status = 500;
    next(err);
  } else {
    response.send("Phew! Can keep playing Error Roulette for now...")
  }
})

// Error-handling middleware example - note that this callback function has four parameters, rather than three!
app.use(function(err, request, response, next){
  console.log('Something went wrong!', err);
  response.send('Something went wrong: ' + err.message);
});

// Router example
var router = express.Router();

router.get('/crow', function(request, response, next){
  response.send("caw");
});

router.get('/chicken', function(request, response, next){
  response.send("bawk");
});

router.get('/turkey', function(request, response, next){
  response.send("gobble")
});

// Here we are hooking are router into our main express app; we're also "mounting" our routes, so requests should be made to "localhost:1337/birds/crow", etc.
app.use('/birds', router);

// Because our custom error-handling middleware is defined above where we've added our router, birds errors won't get "caught" by it.
// e.g. request to /bird/crow
