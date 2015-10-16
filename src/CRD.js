'use strict';

const VERSION = 1;

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
        this.molecules[i].sim = 1;
    }
};

CRD.prototype.search = function (numberCrit, molCrit) {
    this.reset();
    for (var i = 0; i < this.length; i++) {
        for (var j = 0; j < numberCrit.length; j++) {
            if(!numberCrit[j].match(this[numberCrit[j].field][i])) {
                this.molecules[i].sim = 0;
                break;
            }
        }
    }

    if (molCrit) {
        switch (molCrit.mode.toLowerCase()) {
            case 'exact':
                this.exactSearch(molCrit.query);
                break;
            case 'substructure':
                this.substructureSearch(molCrit.query);
                break;
            case 'similarity':
                this.similaritySearch(molCrit.query);
                break;
            default:
                throw new Error('unknown search mode: ' + molCrit.mode);
        }
    }

    this.molecules.sort(sortBySimilarity);
    this.sorted = false;

    //var result = [];
    //for (var i = 0; i < this.length; i++) {
    //    if (this.molecules[i].sim !== 0) {
    //        result.push(this.molecules[i]);
    //    }
    //}
    //return result;
};

CRD.prototype.exactSearch = function (query) {
    const oclid = query.getIDCode();
    for (var i = 0; i < this.length; i++) {
        if (this.molecules[i].sim !== 0 && this.molecules[i].oclid !== oclid) {
            this.molecules[i].sim = 0;
        }
    }
};

function Molecule(id, mw, oclid, sortid) {
    this.id = id;
    this.sim = 1;
    this.mw = mw;
    this.oclid = oclid;
    this.sortid = sortid;
}

function sortById(mol1, mol2) {
    return mol2.sortid - mol1.sortid;
}

function sortBySimilarity(mol1, mol2) {
    return mol2.sim - mol1.sim;
}
