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

// browser (or at least, Chrome) only makes GET requests from URL bar; how to make POST or PUT? curl, and later, we'll learn other ways
app.get('/example', function(request, response){
  response.send("You made a GET request!");
});

// curl http://localhost:1337/example -X POST
app.post('/example', function(request, response){
  response.send("You made a POST request!");
});

app.put('/example', function(request, response){
  response.send("You made a PUT request!");
});

// routes are NOT filepaths; routes are strings that you get to specify
app.get('/example.html', function(request, response){
  response.send("I am not a file.");
});

app.get('/example', function(request, response){
  response.sendFile(__dirname + '/example.html');
});

// a simple CR app (Create/Read)
var cats = [];

app.get('/cats', function(request, response){
  response.json(cats);
});

app.post('/cats', function(request, response){
  var cat = Math.random() > 0.5 ? cat = '😺' : cat = '😿';
  cats.push(cat);
  response.json(cats);
});

// // request.query example
// app.get('/cats', function(request, response){
//   console.log(request.query);

//   var filteredCats = cats;
//   if (request.query.emotion == 'happy') {
//     filteredCats = cats.filter(cat => cat === '😺');
//   } else if (request.query.emotion == 'sad') {
//     filteredCats = cats.filter(cat => cat === '😿')
//   }

//   response.json(filteredCats);
// });

// req.params example
app.get('/cats/:index', function(request, response){
  response.json(cats[req.params.index]);
});

app.get('/multiplication/:num1/:num2', function(request, response){
  var product = request.params.num1 * request.params.num2;
  response.json(product);
});

// middleware: an extra step that happens in between input (request) and output (response)

// next: forwards on to the next match route handler
app.get('/something', function(request, response, next) {
  // response.send("Firstly!") // can't set headers after they are sent, i.e. can't send more than one response
  console.log('Firstly!'); // this will show up in our server's console
  next(); // must either call next or send a response in your route handlers
});

app.get('/something', function(request, response, next){
  response.send('Finally!');
});

// matches all verbs and URIs, including partial URI-matching
app.use(function(request, response, next){
  console.log("I always run")
  next();
});

app.get('/something', function(request, response, next) {
  response.send('Finally!');
});

app.get('/roulette', function(request, response, next){
  if (Math.random() > 0.5) {
    var err = new Error('You lost Error Roulette.');
    err.status = 500;
    next(err);
  } else {
    response.send("Phew! Can keep playing Error Roulette for now...")
  }
})

app.use(function(err, request, response, next){
  console.log('Something went wrong!', err);
  response.send('Something went wrong: ' + err.message);
});

var router = express.Router();

router.get('/crow', function(request, response, next){
  response.send("caw, caw, caw");
});

router.get('/chicken', function(request, response, next){
  response.send("bawk, bawk, bawk");
});

router.get('/turkey', function(request, response, next){
  response.send("gobble, gobble, gobble")
});

app.use('/birds', router);
// birds errors won't get "caught" by our error-handling middleware!
// e.g. request to /bird/crow
