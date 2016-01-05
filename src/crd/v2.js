'use strict';

const CRDB = require('../crdb');
const types = require('./types');

exports.VERSION = 2;

exports.read = function (buffer) {
    var i;
    const fieldNumber = buffer.readUint16();

    const fields = new Array(fieldNumber);
    for (i = 0; i < fieldNumber; i++) {
        fields[i] = readField(buffer);
    }

    const dataLength = buffer.readUint32();
    const crd = new CRDB(dataLength);

    crd.fields['mw'] = new Float32Array(dataLength);

    for (i = 0; i < fieldNumber; i++) {
        const field = fields[i];
        crd.fields[field.name] = new field.type.constructor(field.length * dataLength);
    }

    for (i = 0; i < dataLength; i++) {
        crd.nextMolecule();
        const oclid = buffer.readChars(buffer.readUint16());
        for (var j = 0; j < 16; j++) {
            crd.index[i * 16 + j] = buffer.readUint32();
        }
        const mw = buffer.readFloat32();
        crd.fields.mw[i] = mw;
        crd.setMolecule(oclid, mw);
        for (var j = 0; j < fieldNumber; j++) {
            crd.fields[fields[j].name][i * fields[j].length] = fields[j].type.read(buffer);
        }
    }

    return crd;
};

function readField(buffer) {
    return {
        type: types.get(buffer.readUint8()),
        length: buffer.readUint8(),
        name: buffer.readChars(buffer.readUint8())
    };
}
