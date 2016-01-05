'use strict';

const types = [
    , // structure: [name, constructor, reader, writer, generalType, multiReader]
    [1, 'uint8', Uint8Array, b => b.readUint8(), (b, v) => b.writeUint8(v), 'number'],
    [2, 'uin16', Uint16Array, b => b.readUint16(), (b, v) => b.writeUint16(v), 'number'],
    [3, 'uint32', Uint32Array, b => b.readUint32(), (b, v) => b.writeUint32(v), 'number'],
    [4, 'int8', Int8Array, b => b.readInt8(), (b, v) => b.writeInt8(v), 'number'],
    [5, 'int16', Int16Array, b => b.readInt16(), (b, v) => b.writeInt16(v), 'number'],
    [6, 'int32', Int32Array, b => b.readInt32(), (b, v) => b.writeInt32(v), 'number'],
    [7, 'float32', Float32Array, b => b.readFloat32(), (b, v) => b.writeFloat32(v), 'number'],
    [8, 'float64', Float64Array, b => b.readFloat64(), (b, v) => b.writeFloat64(v), 'number'],
    [9, 'ascii', Array, b => b.readChar(), (b, v) => b.writeChar(v), 'number', (b, n) => b.readChars(n)]
].map(t => ({
    id: t[0],
    name: t[1],
    constructor: t[2],
    read: t[3],
    write: t[4],
    generalType: t[5]
    readMulti: t[6]
}));

const byName = {};
types.forEach(t => byName[t.name] = t);

exports.get = function (type) {
    return types[type] || byName[type] || null;
};
