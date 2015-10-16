'use strict';

const fs = require('fs');
const readCRD = require('..').readCRD;
const comp = require('..').comparators;
const Molecule = require('openchemlib').Molecule;

const data = fs.readFileSync('data/chembl_20_nano.crd');

console.time('load');
var crd = readCRD(data);
console.timeEnd('load');

console.log('length', crd.length);

console.time('search');
var result = crd.search([
    {
        field: 'mw',
        match: comp.lt(500)
    },
    {
        field: 'psa',
        match: comp.lte(120)
    }
], {
    mode: 'substructure',
    query: Molecule.fromSmiles('CCCOCC')
});
console.log(crd.molecules[1]);
//console.log(res.length);
console.timeEnd('search');
