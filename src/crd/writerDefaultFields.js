'use strict';

const types = require('./types');

const float32 = types.get('float32');
const uint32 = types.get('uint32');

module.exports = [
    {
        name: 'em',
        type: float32,
        length: 1
    },
    {
        name: 'logp',
        type: float32,
        length: 1
    },
    {
        name: 'logs',
        type: float32,
        length: 1
    },
    {
        name: 'psa',
        type: float32,
        length: 1
    },
    {
        name: 'acc',
        type: uint32,
        length: 1
    },
    {
        name: 'don',
        type: uint32,
        length: 1
    },
    {
        name: 'rot',
        type: uint32,
        length: 1
    },
    {
        name: 'ste',
        type: uint32,
        length: 1
    }
];
