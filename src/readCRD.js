'use strict';

const CRD = require('./CRD');
const IOBuffer = require('iobuffer');

module.exports = readCRD;

function readCRD(data) {
    const buffer = new IOBuffer(data);
    const version = buffer.readUint16();
    if (version !== CRD.VERSION) {
        throw new Error(`unsupported CRD version: ${version}. Current version is ${CRD.VERSION}`);
    }
    const dataLength = buffer.readUint32();
    const crd = new CRD(dataLength);
    for (var i = 0; i < dataLength; i++) {
        const id = buffer.readUint32();
        const oclid = buffer.readChars(buffer.readUint16());
        for (var j = 0; j < 16; j++) {
            crd.index[i * 16 + j] = buffer.readUint32();
        }
        crd.em[i] = buffer.readFloat32();
        const mw = buffer.readFloat32();
        crd.mw[i] = mw;
        crd.setMol(id, mw, oclid, i);
        crd.logp[i] = buffer.readFloat32();
        crd.logs[i] = buffer.readFloat32();
        crd.psa[i] = buffer.readFloat32();
        crd.acc[i] = buffer.readUint32();
        crd.don[i] = buffer.readUint32();
        crd.rot[i] = buffer.readUint32();
        crd.ste[i] = buffer.readUint32();
    }
    return crd;
}
