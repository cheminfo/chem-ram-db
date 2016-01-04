'use strict';

const IOBuffer = require('iobuffer');

module.exports = readCRD;

function readCRD(data) {
    const buffer = new IOBuffer(data);
    const version = buffer.readUint16();

    let CRD;
    try {
        CRD = require(`./crd/v${version}`);
    } catch (e) {
        throw new Error(`could not find CRD version ${version}`);
    }

    return CRD.read(buffer);
}
