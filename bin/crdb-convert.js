#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const CRDB = require('..');

program
    .option('-i, --input <filename>', 'Input file')
    .option('-o, --output [filename]', 'Output file. If nothing is specified, data will be sent to stdout')
    .option('--id [id]', 'ID field in the input file', 'id')
    .parse(process.argv);

let inputStream;
if (process.stdin.isTTY) {
    if (!program.input) {
        throw new Error('input option is mandatory');
    }
    throw new Error('Unimplemented');
} else {
    inputStream = process.stdin;
}

let outputStream;
if (process.output) {
    throw new Error('Unimplemented');
} else {
    outputStream = process.stdout;
}

CRDB.parseSDF(inputStream, {
    id: program.id,
    csv: false
}).then(function (data) {
    outputStream.write(new Buffer(data.crd));
}, function (error) {
    console.error('ERROR: ', error);
});
