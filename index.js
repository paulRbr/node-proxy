var express = require('express')
var app = express();
var proxy = require('proxy-middleware');
var url = require('url');

app.set('port', (process.env.PORT || 5000))

app.get('/', function(request, response) {
   response.send('Hello World!')
})


app.all('/*', function(req, res, next) {
   res.header("Access-Control-Allow-Origin", process.env.ORIGIN_HOST);
   res.header("Access-Control-Allow-Credentials", "true");
   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
   res.header("Access-Control-Allow-Headers", req.headers["access-control-request-headers"]);

   // intercept OPTIONS method
   if ('OPTIONS' == req.method) {
      res.send(200);
   }
   else {
      req.headers['origin'] = process.env.DESTINATION_HOST;
      req.headers['referer'] = process.env.DESTINATION_HOST;
      next();
   }
});

app.use('/api', proxy(url.parse(process.env.DESTINATION_HOST+'/api')));

app.listen(app.get('port'), function() {
  console.log("Node app is running on localhost:" + app.get('port'))
})
