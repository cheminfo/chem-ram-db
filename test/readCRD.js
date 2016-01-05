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
console.log(crd.molecules[0]);
console.log(crd.molecules[1]);

//var numSearch = [
//    {
//        field: 'mw',
//        match: comp.lt(500)
//    },
//    {
//        field: 'psa',
//        match: comp.lte(120)
//    }
//];

console.time('search');
crd.search(null, {
    mode: 'similarity',
    query: Molecule.fromIDCode('gFp@DiTt@@@')
});crd.search(null, {
    mode: 'similarity',
    query: Molecule.fromIDCode('gFp@DiTt@@@')
});
console.timeEnd('search');

//console.log(crd.molecules[0]);
//console.log(crd.molecules[1]);
