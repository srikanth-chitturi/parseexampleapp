

var express = require('express');
var ParseServer = require('parse-server').ParseServer;
var path = require('path');

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
  appId: process.env.APP_ID || 'N7iEd4UsrBfExFr00uAUiFoBrsVEeWNsgJDyPJno',
  masterKey: process.env.MASTER_KEY || 'WH5OgycXTq45fTpEqitjseTefP3LndqhKvJReFd3', 
  serverURL: serverUrl,  
  liveQuery: {
    classNames: ["Posts", "Comments"] 
  }
});

var app = express();

// Serve static assets from the /public folder
app.use('/public', express.static(path.join(__dirname, '/public')));


var mountPath = process.env.PARSE_MOUNT || '/parse';
app.use(mountPath, api);


app.get('/', function(req, res) {
  res.status(200).send('This is home page , go to test page');
});

//The main application can be tested from here
app.get('/test', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/test.html'));
});

var port = process.env.PORT || 1337;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('parse-server-example running on port ' + port + '.');
});

ParseServer.createLiveQueryServer(httpServer);
