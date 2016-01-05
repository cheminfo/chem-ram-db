#!/usr/bin/env node

'use strict';

const program = require('commander');
const fs = require('fs');
const CRDB = require('..');

program
    .option('-i, --input <filename>', 'Input file')
    .option('-o, --output [filename]', 'Output file. If nothing is specified, data will be sent to stdout')
    .option('-c, --config [filename]', 'Configuration file')
    .parse(process.argv);

let inputStream;
if (process.stdin.isTTY) {
    if (!program.input) {
        throw new Error('input option is mandatory');
    }
    inputStream = fs.createReadStream(program.input);
} else {
    inputStream = process.stdin;
}

let outputStream;
if (process.output) {
    fs.createWriteStream(process.output);
} else {
    outputStream = process.stdout;
}

let config;
if (program.config) {
    config = require(require('path').resolve(program.config));
}

CRDB.parseSDF(inputStream, config).then(function (data) {
    outputStream.write(data);
}, function (error) {
    console.error('ERROR: ', error);
});
