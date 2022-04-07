var express = require('express')
const perf = require('execution-time')();
// var bins;
// var items;
var accesstoken;
const PORT = process.env.PORT || 3000;
app = express(),
    app.use(
        express.urlencoded({
            extended: true
        })
    )
app.use(express.json())
// Access the parse results as request.body
app.post('/', function(request, response){
    perf.start();
    // bins = JSON.parse(request.body.bins);
    // items = JSON.parse(request.body.items);
    const results = perf.stop();
    var jsonresponse = {"sampleresponse": result[0],"executiontime": results};
    response.send(jsonresponse);
});

if(accesstoken == undefined){
    app.use(express.static('www'));
    console.log('3dbin html server started on: ' + PORT);
}else{
    console.log('3dbin RESTful API server started on: ' + PORT);
}

require("binpacking.js")

app.listen(PORT);