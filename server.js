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
    console.log('3dbin html server started on: ' + PORT);
}else{
    console.log('3dbin RESTful API server started on: ' + PORT);
}

let binSample = {
    width: 60,
    height: 60,
    depth: 60
};

let packageSample1 = {
    width: 16,
    height: 23,
    depth: 2,
    amount: 100
};

let packageSample2 = {
    width: 22,
    height: 26,
    depth: 2,
    amount: 120
};

let packageSample3 = {
    width: 14,
    height: 26,
    depth: 10,
    amount: 200
};


let packageSamples = [packageSample1, packageSample2, packageSample3].filter(packageSample => packageSample.amount > 0);
packageSamples = sortPackageSamples(packageSamples);

function sortPackageSamples(packageSamples) {
    return packageSamples.sort((prev, next) => {
        const height1 = prev.height;
        const height2 = next.height;

        const width1 = prev.width;
        const width2 = next.width;

        if (height1 > height2) return -1;
        if (height1 < height2) return 1;
        if (width1 > width2) return -1;
        if (width1 < width2) return 1;
        return 0;
    });
}

const AXIS = {
    x: 'x',
    y: 'y',
    z: 'z'
};

function getAxisToDimensionMap() {
    return {
        x: 'width',
        y: 'depth',
        z: 'height'
    };
}

function getDimensionOfAxis(dimensionalObject, axis) {
    return dimensionalObject[getAxisToDimensionMap()[axis]];
}

function createBin(binSample) {
    return { ...binSample, layers: [createLayer()] };
}

function createLayer() {
    return {
        columns: [createColumn()]
    };
}

function createColumn() {
    return { packageReferences: [] };
}

export function getFirstColumn(layer) {
    const [firstColumn] = layer.columns.slice(0, 1);
    return firstColumn;
}

function getLastColumn(layer) {
    const [lastColumn] = layer.columns.slice(-1);
    return lastColumn;
}

function getFirstPlacedPackageOfColumn(column) {
    const [firstPlacedPackage] = column.packageReferences.slice(0, 1)
    return firstPlacedPackage;
}

function getLastPlacedPackageOfColumn(column) {
    const [lastPlacedPackage] = column.packageReferences.slice(-1)
    return lastPlacedPackage;
}

function calculateRemainingGap(originPackage, bin, placingAxis) {
    const totalSize = getDimensionOfAxis(bin, placingAxis);
    const startingPosition = originPackage[placingAxis] + getDimensionOfAxis(originPackage, placingAxis);

    const remainingGap = totalSize - startingPosition;

    return Math.max(-1, remainingGap);
}

export function calculateAmountOfPackageToBePlaced(remainingGap, packageToBePlaced, placingAxis) {
    return Math.floor(remainingGap / getDimensionOfAxis(packageToBePlaced, placingAxis));
}

function createPackagePlaceReference(packageSample, position) {
    const { width, height, depth } = packageSample;

    return {
        width,
        height,
        depth,
        ...position
    }
}

function getWidthOfWidestPackageInColumn(column, initialValue) {
    return column.packageReferences.reduce((highest, nextPackage) => nextPackage.width > highest ? nextPackage.width : highest, initialValue)
}

let bins = [];
let currentBinIndex = 0;

for (let currentPackageSample of packageSamples) {
    while (currentPackageSample.amount > 0) {
        let currentBin = bins[currentBinIndex];

        if (!currentBin) {
            currentBin = createBin(binSample);
            bins.push(currentBin);
        }

        let [currentLayer] = currentBin.layers.slice(-1);
        let originPackage = getLastPlacedPackageOfColumn(getLastColumn(currentLayer));
        let remainingGap = originPackage ? calculateRemainingGap(originPackage, currentBin, AXIS.y) : currentBin.depth;
        let fistPlacedPackagePosition;

        if (remainingGap < currentPackageSample.depth) {
            originPackage = getFirstPlacedPackageOfColumn(getLastColumn(currentLayer));
            remainingGap = calculateRemainingGap(originPackage, currentBin, AXIS.x);

            if (remainingGap < currentPackageSample.width) {
                originPackage = getFirstPlacedPackageOfColumn(getFirstColumn(currentLayer));
                remainingGap = calculateRemainingGap(originPackage, currentBin, AXIS.z);

                if (remainingGap < currentPackageSample.height) {
                    currentBinIndex++;
                    continue;
                }

                currentLayer = createLayer();
                currentBin.layers.push(currentLayer);

                fistPlacedPackagePosition = { x: 0, y: 0, z: originPackage.z + originPackage.height }; //new layer's first package
                remainingGap = currentBin.depth;
            } else {
                currentLayer.columns.push({ packageReferences: [] }); // create a new column in the current layer
                const widthOfWidestPackageInColumn = getWidthOfWidestPackageInColumn(getLastColumn(currentLayer), originPackage.width);
                fistPlacedPackagePosition = { x: originPackage.x + widthOfWidestPackageInColumn, y: 0, z: originPackage.z };
                remainingGap = currentBin.depth;
            }
        } else {
            if (originPackage) {
                fistPlacedPackagePosition = {
                    x: originPackage.x,
                    y: originPackage.y + originPackage.depth,
                    z: originPackage.z
                };
            } else {
                fistPlacedPackagePosition = { x: 0, y: 0, z: 0 }; // very first package in the bin
            }
        }


        const lastColumn = getLastColumn(currentLayer);
        lastColumn.packageReferences.push(createPackagePlaceReference(currentPackageSample, fistPlacedPackagePosition));

        let amountOfPackageToBePlaced = calculateAmountOfPackageToBePlaced(remainingGap, currentPackageSample, AXIS.y);
        currentPackageSample.amount -= amountOfPackageToBePlaced;

        const lastPlacedPackagePosition = { ...fistPlacedPackagePosition };
        lastPlacedPackagePosition.y = (amountOfPackageToBePlaced - 1) * currentPackageSample.depth;

        lastColumn.packageReferences.push(createPackagePlaceReference(currentPackageSample, lastPlacedPackagePosition));
    }

    bins = bins.reverse();
    currentBinIndex = 0;
}

// console.log(JSON.stringify(bins));
console.log(bins.length);

// Parse JSON bodies (as sent by API clients)
app.listen(PORT);