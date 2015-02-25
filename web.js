var express = require('express');

var app = express();

var create_url = 'https://connect.heroku.com/dashboard-next/create-connection';

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

app.get('/create', function(req, res){
  var hostRe = new RegExp(/^([^.]+)\.herokuapp\.com$/);

  var match = req.headers.host.match(hostRe);

  if (match) {
    res.redirect(create_url+'?create='+match[1]);
  } else {
    res.status(400).send("You need to be running on Heroku!");
  }
});

var httpPort = Number(process.env.PORT || 3000);
app.listen(httpPort);
console.log("Express server listening on port %d in %s mode", httpPort, app.settings.env);