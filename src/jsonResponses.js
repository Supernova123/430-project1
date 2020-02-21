// Note this object is purely in memory
// When node shuts down this will be cleared.
// Same when your heroku app shuts down from inactivity
// We will be working with databases in the next few weeks.
const accounts = {};

//function to respond with a json object
//takes request, response, status code and object to send
const respondJSON = (request, response, status, object) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.write(JSON.stringify(object));
  response.end();
};

//function to respond without json body
//takes request, response and status code
const respondJSONMeta = (request, response, status) => {
  response.writeHead(status, { 'Content-Type': 'application/json' });
  response.end();
};

//return user object as JSON
const getAccount = (request, response) => {
  const responseJSON = {
    accounts,
  };

  respondJSON(request, response, 200, responseJSON);
};

//function to add a user from a POST body
const addAccount = (request, response, body) => {
  //default json message
  const responseJSON = {
    message: 'Username and password are both required.',
  };

  //check to make sure we have both fields
  //We might want more validation than just checking if they exist
  //This could easily be abused with invalid types (such as booleans, numbers, etc)
  //If either are missing, send back an error message as a 400 badRequest
  if (!body.word || !body.definition) {
    responseJSON.id = 'missingParams';
    return respondJSON(request, response, 400, responseJSON);
  }

  //default status code to 201 created
  let responseCode = 201;

  //if that user's name already exists in our object
  //then switch to a 204 updated status
  if (accounts[body.username]) {
    responseCode = 204;
  } else {
    //otherwise create an object with that name
    accounts[body.username] = {};
  }

  //add or update fields for this user name
  accounts[body.username].username = body.username;
  accounts[body.username].password = body.password;

  //if response is created, then set our created message
  //and sent response with a message
  if (responseCode === 201) {
    responseJSON.message = 'Created Successfully';
    return respondJSON(request, response, responseCode, responseJSON);
  }
  // 204 has an empty payload, just a success
  // It cannot have a body, so we just send a 204 without a message
  // 204 will not alter the browser in any way!!!
  return respondJSONMeta(request, response, responseCode);
};

const notFound = (request, response) => {
    const responseJSON = {
        message: 'The page you are looking for was not found!',
        id: 'notFound',
    };
    
    return respondJSON(request, response, 404, responseJSON);
};

const notFoundMeta = (request, response) => {
    return respondJSONMeta(request, response, 404);
};

//public exports
module.exports = {
  getAccount,
  addAccount,
  respondJSON,
  respondJSONMeta,
  notFound,
  notFoundMeta
};
