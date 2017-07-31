/**
 * Created by Dr.Legendaddy on 24.07.2017.
 */
//Express required
var express = require('express');
var app = express();

//Setting Port and scope
app.set('port', (process.env.PORT || 5000));
app.use(express.static(__dirname));

//Setting index html for our entry point
app.get('/', function(request, response) {
    response.location("/index.html");
});

//Console log for information about Port on localhost
app.listen(app.get('port'), function() {
    console.log("Node app is running at localhost:" + app.get('port'))
});
