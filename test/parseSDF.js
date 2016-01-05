'use strict';

const fs = require('fs');
const zlib = require('zlib');
const parseSDF = require('..').parseSDF;

var stream = fs.createReadStream('data/chembl_20_nano.sdf');
//var stream = fs.createReadStream('data/chembl_20.sdf.gz')
//    .pipe(zlib.createGunzip());

parseSDF(stream, {
    customFields: [
        {
            type: 'uint32',
            name: 'chembl_id'
        }
    ]
}).then(function (result) {
    fs.writeFileSync('data/chembl_20_nano.crd', new Buffer(result.crd))
}, function (err) {
    console.log('error:', err);
});
