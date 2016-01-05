'use strict';

const types = exports.list = [
    null,
    'uint8', 'uint16', 'uint32',
    'int8', 'int16', 'int32',
    'float32', 'float64',
    'ascii'
];

const byName = exports.byName = {};
for (var i = 1; i < types.length; i++) {
    byName[types[i]] = i;
}

exports.exists = function (type) {
    return !!(types[type] || byName[type]);
};
