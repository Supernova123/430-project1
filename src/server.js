const http = require('http'); //http module
const url = require('url'); //url module
const htmlHandler = require('./htmlResponses.js'); 
const jsonHandler = require('./jsonResponses.js'); 

const port = process.env.PORT || process.env.NODE_PORT || 3000;

//here we create a object to route our requests to the proper
//handlers. the top level object is indexed by the request
//method (get, head, etc). We can use request.method to return
//the routing object for each type of method. Once we say
//urlStruct[request.method], we recieve another object which
//routes each individual url to a handler. We can index this
//object in the same way we have used urlStruct before.
const urlStruct = {
  'GET': {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getCSS,
    '/getWords': jsonHandler.getWords,
    '/updateWord': jsonHandler.updateWords,
    notFound: jsonHandler.notFound,
  }
};


//function to handle requests
const onRequest = (request, response) => {
  //first we have to parse information from the url
  const parsedUrl = url.parse(request.url);
  
  //now we check to see if we have something to handle the
  //request. This syntax may look verbose, but essentially
  //what we are doing is indexing into urlStruct by the method
  //which returns another object. We then index into that object
  //by the pathname to get the handler. Inside the if, we can
  //use that same syntax to call the actual function.
  if(urlStruct[request.method][parsedUrl.pathname]){
    urlStruct[request.method][parsedUrl.pathname](request, response);
  } else {
    urlStruct[request.method].notFound(request, response);
  }
};

//start server
http.createServer(onRequest).listen(port);

console.log(`Listening on 127.0.0.1: ${port}`);