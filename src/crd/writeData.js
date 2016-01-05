'use strict';

const writers = {
    uint8: (crd, value) => crd.writeUint8(value),
    uint16: (crd, value) => crd.writeUint16(value),
    uint32: (crd, value) => crd.writeUint32(value),
    int8: (crd, value) => crd.writeInt8(value),
    int16: (crd, value) => crd.writeInt16(value),
    int32: (crd, value) => crd.writeInt32(value),
    float32: (crd, value) => crd.writeFloat32(value),
    float64: (crd, value) => crd.writeFloat64(value),
    ascii: (crd, value) => crd.writeChar(value)
};

module.exports = function (crd, field, value) {
    switch (field.length) {
        case 0:
            crd.writeUint16(value.length);
            for (var i = 0; i < value.length; i++) {
                writers[field.type](crd, value[i]);
            }
            break;
        case 1:
            writers[field.type](crd, value);
            break;
        default:
            for (var i = 0; i < field.length; i++) {
                writers[field.type](crd, value[i]);
            }
            break;
    }
};
