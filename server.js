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
    console.log('3dbin html server started on : ' + PORT);
}else{
    console.log('3dbin RESTful API server started on: ' + PORT);
}



const BinPacking = require('./bp3d');
const Item = BinPacking.Item;
const Bin = BinPacking.Bin;
const Packer = BinPacking.Packer;

let bin1 = new Bin("Le petite box", 296, 296, 8, 1000);
let item1 = new Item("Item 1", 250, 250, 2, 200);
let item2 = new Item("Item 2", 250, 250, 2, 200);
let item3 = new Item("Item 3", 250, 250, 2, 200);
let packer = new Packer();

packer.addBin(bin1);
packer.addItem(item1);
packer.addItem(item2);
packer.addItem(item3);

// pack items into bin1
packer.pack();

// item1, item2, item3
console.log(bin1.items);

// items will be empty, all items was packed
console.log(packer.items);

// unfitItems will be empty, all items fit into bin1
console.log(packer.unfitItems)
app.listen(PORT);