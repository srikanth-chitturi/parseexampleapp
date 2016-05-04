

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');
var Parse = require('node-parse-api').Parse;
var bodyParser = require('body-parser');


var APP_ID = 'N7iEd4UsrBfExFr00uAUiFoBrsVEeWNsgJDyPJno';
var MASTER_KEY = 'WH5OgycXTq45fTpEqitjseTefP3LndqhKvJReFd3';

var parseApp = new Parse(APP_ID,MASTER_KEY);
var sessionToken = '';

//MongoDB url
var databaseUri = 'mongodb://user1:user1@ds013212.mlab.com:13212/parse';

if (process.env.NODE_ENV === 'production') {
    serverUrl = 'https://parseapp123.herokuapp.com/parse';
}
else{
    serverUrl = 'http://localhost:1337/parse'
}

if (!databaseUri) {
  console.log('DATABASE_URI not specified, falling back to localhost.');
}

var api = new ParseServer({
  databaseURI: databaseUri || 'mongodb://localhost:27017/dev',
  cloud: process.env.CLOUD_CODE_MAIN || __dirname + '/cloud/main.js',
  appId: process.env.APP_ID || APP_ID,
  masterKey: process.env.MASTER_KEY || MASTER_KEY, 
  serverURL: serverUrl,  
  liveQuery: {
    classNames: ["Posts", "Comments"] 
  }
});

var app = express();

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));


var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


app.get('/', function(req, res) {
  //res.status(200).send('This is home page , go to test page');
  res.sendFile(path.join(__dirname, '/public/index.html'));
});


app.post('/', function(req, res){
  var userName = req.body.username;
  var password = req.body.password;
  //console.log(userName);
  parseApp.loginUser(userName, password, function (error, response) {
  //console.log(sessionToken);
  if(error){
    return res.send("<html><h1>Invalid UserName/Password</h1><a href=/>Signin</a></html>");
  }
  if(response)
  {
    //console.log(response);  
    sessionToken = response.sessionToken;
    res.redirect('/test');
  }
  });

});

app.post('/signup', function(req, res){
  var userName = req.body.username;
  var password = req.body.password;
  //console.log('creating new user :'+userName);
  parseApp.insertUser({
  username: userName,
  password: password
  }, function (error, response) {
  if(error){
    return res.send("<html><h1>A User with this username is already created , please select a different username or signin </h1><a href=/>Signin</a></html>");
  }
  if(response)
  {
    sessionToken = response.sessionToken;
    console.log(sessionToken);
    res.redirect('/test');
  }
});

});


//The main application can be tested from here
app.get('/test', function(req, res) {
  if(sessionToken != '')
  {
    res.sendFile(path.join(__dirname, '/public/test.html'));  
  }
  else{
    return res.send("<html><h1>Error you are not authorized to access this page , please sign in</h1><a href=/>Signin</a></html>");
  }
  
});

app.get('/signup', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/signup.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

ParseServer.createLiveQueryServer(httpServer);
