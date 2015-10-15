'use strict';

const sdfStream = require('./SDFStream');
const OutputBuffer = require('iobuffer').OutputBuffer;
const Molecule = require('openchemlib').Molecule;

module.exports = function parseSDF(stream, options) {
    return new Promise((resolve, reject) => {
        let id = options.id;
        let getID = id;
        if (typeof id === 'string') {
            getID = function (mol) {
                return mol[id];
            };
        }
        const tsv = [];
        const crd = new OutputBuffer();
        crd.skip(4); // we will put the size in the first 4 bytes but it is currently unknown
        let total = 0;
        stream = stream.pipe(sdfStream());
        stream.on('data', function (mol) {
            total++;
            const id = getID(mol);
            const molecule = Molecule.fromMolfile(mol.molfile.value);
            const oclid = molecule.getIDCode();
            tsv.push(oclid + '\t' + id);
            crd.writeUint32(id);
            crd.writeUint16(oclid.length);
            crd.writeChars(oclid);
        });
        stream.on('end', function () {
            crd.mark(); // todo hack because of https://github.com/image-js/iobuffer/issues/4
            crd.rewind();
            crd.writeUint32(total);
            crd.reset();
            resolve({
                tsv: tsv.join('\n'),
                crd: crd.toArray()
            });
        });
        stream.on('error', reject);
    });
};
