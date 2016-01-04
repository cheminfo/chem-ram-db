'use strict';

const CRDB = require('../crdb');

exports.read = function (buffer) {
    const dataLength = buffer.readUint32();
    const crd = new CRDB(dataLength);

    crd.fields.id = new Uint32Array(dataLength);
    crd.fields.em = new Float32Array(dataLength);
    crd.fields.mw = new Float32Array(dataLength);
    crd.fields.logp = new Float32Array(dataLength);
    crd.fields.logs = new Float32Array(dataLength);
    crd.fields.psa = new Float32Array(dataLength);
    crd.fields.acc = new Uint32Array(dataLength);
    crd.fields.don = new Uint32Array(dataLength);
    crd.fields.rot = new Uint32Array(dataLength);
    crd.fields.ste = new Uint32Array(dataLength);

    for (var i = 0; i < dataLength; i++) {
        crd.nextMolecule();
        const id = buffer.readUint32();
        const oclid = buffer.readChars(buffer.readUint16());
        for (var j = 0; j < 16; j++) {
            crd.index[i * 16 + j] = buffer.readUint32();
        }
        crd.fields.id[i] = id;
        crd.fields.em[i] = buffer.readFloat32();
        const mw = buffer.readFloat32();
        crd.fields.mw[i] = mw;
        crd.setMolecule(oclid, mw);
        crd.fields.logp[i] = buffer.readFloat32();
        crd.fields.logs[i] = buffer.readFloat32();
        crd.fields.psa[i] = buffer.readFloat32();
        crd.fields.acc[i] = buffer.readUint32();
        crd.fields.don[i] = buffer.readUint32();
        crd.fields.rot[i] = buffer.readUint32();
        crd.fields.ste[i] = buffer.readUint32();
    }
    return crd;
};
