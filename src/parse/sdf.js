'use strict';

const CRD_VERSION = 1;

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
        crd.writeUint16(CRD_VERSION);
        crd.skip(4); // we will put the size here but it is currently unknown
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
            // Index
            const index = molecule.getIndex();
            for (let i = 0; i < 16; i++) {
                crd.writeUint32(index[i]);
            }
            // MF
            const mf = molecule.getMolecularFormula();
            crd.writeFloat32(mf.getAbsoluteWeight());
            crd.writeFloat32(mf.getRelativeWeight());
            // Props
            const props = molecule.getProperties();
            crd.writeFloat32(props.getLogP());
            crd.writeFloat32(props.getLogS());
            crd.writeFloat32(props.getPolarSurfaceArea());
            crd.writeUint32(props.getAcceptorCount());
            crd.writeUint32(props.getDonorCount());
            crd.writeUint32(props.getRotatableBondCount());
            crd.writeUint32(props.getStereoCenterCount());
        });
        stream.on('end', function () {
            crd.mark(); // todo hack because of https://github.com/image-js/iobuffer/issues/4
            crd.seek(2); // go back to beginning and write number of entries
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
