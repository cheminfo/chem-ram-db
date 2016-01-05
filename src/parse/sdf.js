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
                var value = mol[fields[i].name];
                if (fields[i].parse) {
                    value = fields[i].parse(value);
                }
                crd.writeField(fields[i].name, value);
            }
        });
        stream.on('end', function () {
            crd.finish();
            resolve(new Buffer(crd.toArray()));
        });
        stream.on('error', reject);
    });
};
