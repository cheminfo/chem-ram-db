'use strict';

const CRDB = require('../crdb');
const types = require('./types');

exports.VERSION = 2;

exports.read = function (buffer) {
    const fieldNumber = buffer.readUint16();

    const fields = new Array(fieldNumber);
    for (var i = 0; i < fieldNumber; i++) {
        fields[i] = readField(buffer);
    }

    console.log(fields);
};

function readField(buffer) {
    return {
        type: types.list[buffer.readUint8()],
        length: buffer.readUint8(),
        name: buffer.readChars(buffer.readUint8())
    };
}
