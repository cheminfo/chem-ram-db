'use strict';

const fs = require('fs');
const zlib = require('zlib');
const parseSDF = require('..').parseSDF;

var stream = fs.createReadStream('data/chembl_20_mini.sdf');
//var stream = fs.createReadStream('data/chembl_20.sdf.gz')
//    .pipe(zlib.createGunzip());

parseSDF(stream).then(function (result) {
    fs.writeFileSync('data/chembl_20_mini.crd', new Buffer(result.crd))
}, function (err) {
    console.log('error:', err);
});
