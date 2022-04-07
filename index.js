var express = require('express')
const perf = require('execution-time')();
var bins;
var items;
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
    bins = JSON.parse(request.body.bins);
    items = JSON.parse(request.body.items);
    const results = perf.stop();
    var jsonresponse = {"sampleresponse": result[0],"executiontime": results};
    response.send(jsonresponse);
});

if(bins == undefined){
    app.use(express.static('www'));
    console.log('3dbin RESTful API server started on: ' + PORT);
}else{
    console.log('3dbin RESTful API server started on: ' + PORT);
}


// Parse JSON bodies (as sent by API clients)
app.listen(PORT);