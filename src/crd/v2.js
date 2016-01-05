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

    crd.fields.mw = new Float32Array(dataLength);

    for (i = 0; i < fieldNumber; i++) {
        const field = fields[i];
        if (field.length === 1) {
            crd.fields[field.name] = new field.type.constructor(field.length * dataLength);
        } else {
            crd.fields[field.name] = new Array(dataLength);
        }
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
            const field = fields[j];
            if (field.length === 1) {
                crd.fields[field.name][i] = field.type.read(buffer);
            } else {
                const length = field.length || buffer.readUint16();
                if (field.type.readMulti) {
                    crd.fields[field.name][i] = field.type.readMulti(buffer, length);
                } else {
                    const result = new field.type.constructor(length);
                    for (var k = 0; k < length; k++) {
                        result[k] = field.type.read(buffer);
                    }
                    crd.fields[field.name][i] = result;
                }
            }
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
