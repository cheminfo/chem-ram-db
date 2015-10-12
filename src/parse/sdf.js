'use strict';

const fs = require('fs');
const zlib = require('zlib');

const sdfStream = require('./SDFStream');
const gzipStream = zlib.createGunzip();

var stream = fs.createReadStream('data/chembl_20.sdf.gz')
    .pipe(gzipStream)
    .pipe(sdfStream());

console.time('s');
let data = 0;
stream.on('data', function (a) {
    data++;
  //  process.stdout.write(a.chembl_id + '\n');
   // console.log(a);
   // if (data > 5) throw Error()
});

stream.on('end', function () {
    console.log(data);
    console.timeEnd('s');
});
