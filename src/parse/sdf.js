'use strict';

const Writer = require('../crd/writer');
const sdfStream = require('./SDFStream');
var a = 0;
module.exports = function parseSDF(stream, options) {
    return new Promise((resolve, reject) => {
        const crd = new Writer();
        stream = stream.pipe(sdfStream());
        stream.on('data', function (mol) {
            console.log(a++);
            crd.writeMolfile(mol.molfile.value);
        });
        stream.on('end', function () {
            resolve({
                crd: crd.toArray()
            });
        });
        stream.on('error', reject);
    });
};
