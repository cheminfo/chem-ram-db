'use strict';

const CRDB = require('../crdb');

exports.VERSION = 1;

exports.read = function (buffer) {
    const dataLength = buffer.readUint32();
    const crd = new CRDB(dataLength);

    crd.createField('id', Uint32Array, dataLength);
    crd.createField('em', Float32Array, dataLength);
    crd.createField('mw', Float32Array, dataLength);
    crd.createField('logp', Float32Array, dataLength);
    crd.createField('logs', Float32Array, dataLength);
    crd.createField('psa', Float32Array, dataLength);
    crd.createField('acc', Uint32Array, dataLength);
    crd.createField('don', Uint32Array, dataLength);
    crd.createField('rot', Uint32Array, dataLength);
    crd.createField('ste', Uint32Array, dataLength);

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
