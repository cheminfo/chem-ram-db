'use strict';

const fs = require('fs');
const readCRD = require('..').readCRD;
const comp = require('..').comparators

const data = fs.readFileSync('data/chembl_20_nano.crd');

console.time('load');
var crd = readCRD(data);
console.timeEnd('load');

console.log('length', crd.length);

console.time('search');
var result = crd.search([
    {
        field: 'mw',
        match: comp.lt(300)
    },
    {
        field: 'psa',
        match: comp.gte(120)
    }
]);
console.log(result.length);
console.log(crd.molecules[0]);
var firstMol = crd.molecules[0].sortid;
console.log(crd.mw[firstMol]);
console.log(crd.psa[firstMol]);
//console.log(res.length);
console.timeEnd('search');
