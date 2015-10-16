#!/usr/bin/env node

'use strict';

const program = require('commander');
const pkg = require('../package.json');

program
    .version(pkg.version)
    .command('convert', 'Convert a data file')
    .parse(process.argv);
