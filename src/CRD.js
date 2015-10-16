'use strict';

const OCL = require('openchemlib');
const SSSearcher = OCL.SSSearcher;
const OCLMolecule = OCL.Molecule;

const VERSION = 1;
const MAX_VALUE = 0xffffffff;

module.exports = CRD;
module.exports.VERSION = VERSION;

function CRD(length) {
    this.length = length;
    this.sorted = true;
    this.molecules = new Array(length);
    this.index = new Uint32Array(length * 16);
    this.em = new Float32Array(length);
    this.mw = new Float32Array(length);
    this.logp = new Float32Array(length);
    this.logs = new Float32Array(length);
    this.psa = new Float32Array(length);
    this.acc = new Uint32Array(length);
    this.don = new Uint32Array(length);
    this.rot = new Uint32Array(length);
    this.ste = new Uint32Array(length);
}

CRD.prototype.setMol = function (id, mw, oclid, sortid) {
    this.molecules[sortid] = new Molecule(id, mw, oclid, sortid);
};

CRD.prototype.reset = function () {
    if (!this.sorted) {
        this.molecules.sort(sortById);
        this.sorted = true;
    }
    for (var i = 0; i < this.length; i++) {
        this.molecules[i].dist = 0;
    }
};

CRD.prototype.search = function (numberCrit, molCrit) {
    this.reset();

    if (numberCrit) {
        for (var i = 0; i < this.length; i++) {
            for (var j = 0; j < numberCrit.length; j++) {
                if (!numberCrit[j].match(this[numberCrit[j].field][i])) {
                    this.molecules[i].dist = MAX_VALUE;
                    break;
                }
            }
        }
    }

    if (molCrit) {
        const limit = molCrit.limit || 1000;
        switch (molCrit.mode.toLowerCase()) {
            case 'exact':
                this.exactSearch(molCrit.query, limit);
                break;
            case 'substructure':
                this.substructureSearch(molCrit.query, limit);
                break;
            case 'similarity':
                this.similaritySearch(molCrit.query, limit);
                break;
            default:
                throw new Error('unknown search mode: ' + molCrit.mode);
        }
    } else {
        this.molecules.sort(sortBySimilarity);
        this.sorted = false;
    }
};

CRD.prototype.exactSearch = function (query, limit) {
    const oclid = query.getIDCode();
    for (var i = 0; i < this.length; i++) {
        if (this.molecules[i].dist !== MAX_VALUE && this.molecules[i].oclid !== oclid) {
            this.molecules[i].dist = MAX_VALUE;
        }
    }
};

let searcher;
CRD.prototype.substructureSearch = function (query, limit) {
    if (!searcher) {
        searcher = new SSSearcher();
    }
    let needReset = false;
    let mw;
    if (!query.isFragment()) {
        mw = query.getMolecularFormula().getRelativeWeight();
        needReset = true;
        query.setFragment(true);
    } else {
        query.setFragment(false);
        mw = query.getMolecularFormula().getRelativeWeight();
        query.setFragment(true);
    }
    searcher.setFragment(query);

    const index = query.getIndex();
    mol: for (var i = 0; i < this.length; i++) {
        if (this.molecules[i].dist !== MAX_VALUE) {
            // first verify the index
            for (var j = 0; j < 16; j++) {
                if ((index[j]&this.index[i * 16 + j]) !== index[j]) {
                    this.molecules[i].dist = MAX_VALUE;
                    continue mol;
                }
            }
            this.molecules[i].dist = Math.abs(this.molecules[i].mw - mw);
        }
    }
    this.molecules.sort(sortByDistance);

    var found = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.molecules[i].dist === MAX_VALUE || found === limit) {
            break;
        }
        // actual SSS
        searcher.setMolecule(OCLMolecule.fromIDCode(this.molecules[i].oclid));
        if (!searcher.isFragmentInMolecule()) {
            this.molecules[i].dist = MAX_VALUE;
        } else {
            found++;
        }
    }
    this.molecules.sort(sortByDistance);

    if (needReset) {
        query.setFragment(false);
    }
};

CRD.prototype.similaritySearch = function (query, limit) {

};

function Molecule(id, mw, oclid, sortid) {
    this.id = id;
    this.dist = 0;
    this.mw = mw;
    this.oclid = oclid;
    this.sortid = sortid;
}

function sortById(mol1, mol2) {
    return mol2.sortid - mol1.sortid;
}

function sortBySimilarity(mol1, mol2) {
    return mol2.dist - mol1.dist;
}

function sortByDistance(mol1, mol2) {
    return mol1.dist - mol2.dist;
}
