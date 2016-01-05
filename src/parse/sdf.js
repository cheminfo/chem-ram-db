'use strict';

const Writer = require('../crd/writer');
const sdfStream = require('./SDFStream');

module.exports = function parseSDF(stream, options) {
    return new Promise((resolve, reject) => {

        options = options || {};
        const fields = options.customFields || [];

        const writerOptions = {
            includeDefaultFields: options.includeDefaultFields,
            fields
        };

        const crd = new Writer(writerOptions);
        stream = stream.pipe(sdfStream());
        stream.on('data', function (mol) {
            crd.writeMolfile(mol.molfile.value);
            for (var i = 0; i < fields.length; i++) {
                crd.writeField(fields[i].name, mol[fields[i].name]);
            }
        });
        stream.on('end', function () {
            crd.finish();
            resolve({
                crd: crd.toArray()
            });
        });
        stream.on('error', reject);
    });
};
