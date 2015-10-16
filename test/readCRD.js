'use strict';

const fs = require('fs');
const readCRD = require('..').readCRD;
const comp = require('..').comparators;
const Molecule = require('openchemlib').Molecule;

const data = fs.readFileSync('data/chembl_20_mini.crd');

console.time('load');
var crd = readCRD(data);
console.timeEnd('load');

console.log('length', crd.length);

var numSearch = [
    {
        field: 'mw',
        match: comp.lt(500)
    },
    {
        field: 'psa',
        match: comp.lte(120)
    }
];

console.time('search');
crd.search(null, {
    mode: 'substructure',
    query: Molecule.fromSmiles('c1ccccc1'),
    limit: 5
});
console.timeEnd('search');
