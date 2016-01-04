'use strict';

const types = require('./types');

module.exports = [
    {
        name: 'em',
        type: types.float32,
        length: 1
    },
    {
        name: 'mw',
        type: types.float32,
        length: 1
    },
    {
        name: 'logp',
        type: types.float32,
        length: 1
    },
    {
        name: 'logs',
        type: types.float32,
        length: 1
    },
    {
        name: 'psa',
        type: types.float32,
        length: 1
    },
    {
        name: 'acc',
        type: types.uint32,
        length: 1
    },
    {
        name: 'don',
        type: types.uint32,
        length: 1
    },
    {
        name: 'rot',
        type: types.uint32,
        length: 1
    },
    {
        name: 'ste',
        type: types.uint32,
        length: 1
    }
];
