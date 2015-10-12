'use strict';

const fs = require('fs');
const sdfStream = require('./SDFStream');

var stream = fs.createReadStream('data/chembl_20.sdf')
    .pipe(sdfStream());

console.time('s');
let data = 0;
stream.on('data', function (a) {
    data++;
});

stream.on('end', function () {
    console.log(data);
    console.timeEnd('s');
});
