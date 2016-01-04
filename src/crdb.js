'use strict';

const sort = require('timsort').sort;
const OCL = require('openchemlib');
const SSSearcher = OCL.SSSearcher;
const OCLMolecule = OCL.Molecule;
const Molecule = require('./molecule');

const MAX_DISTANCE = Molecule.MAX_DISTANCE;
const DEFAULT_LIMIT = 100;

class CRDB {
    constructor(length) {
        this.length = length;
        this.sorted = true;
        this.molecules = new Array(length);
        this.index = new Uint32Array(length * 16);
        this.fields = {};

        this._currentIndex = -1;
        this._searcher = null;
    }

    setMolecule(oclid, mw) {
        this.molecules[this._currentIndex] = new Molecule(oclid, mw, this._currentIndex);
    }

    nextMolecule() {
        this._currentIndex++;
        if (this._currentIndex >= this.length) {
            throw new Error('next molecule is out of bounds');
        }
    }

    reset(force) {
        if (!this.sorted || force) {
            sort(this.molecules, Molecule.compareId);
            this.sorted = true;
        }
        for (var i = 0; i < this.length; i++) {
            this.molecules[i].dist = 0;
        }
    }

    search(numberCrit, molCrit) {
        this.reset();

        if (numberCrit) {
            for (var i = 0; i < this.length; i++) {
                for (var j = 0; j < numberCrit.length; j++) {
                    if (!numberCrit[j].match(this.fields[numberCrit[j].field][i])) {
                        this.molecules[i].dist = MAX_DISTANCE;
                        break;
                    }
                }
            }
        }

        if (molCrit) {
            const limit = molCrit.limit || DEFAULT_LIMIT;
            switch (molCrit.mode.toLowerCase()) {
                case 'exact':
                    this.exactSearch(molCrit.query);
                    break;
                case 'substructure':
                    this.substructureSearch(molCrit.query, limit);
                    break;
                case 'similarity':
                    this.similaritySearch(molCrit.query);
                    break;
                default:
                    throw new Error(`unknown search mode: ${molCrit.mode}`);
            }
        }

        sort(this.molecules, Molecule.compareDistance);
        this.sorted = false;
    }

    exactSearch(query) {
        const oclid = query.getIDCode();
        for (var i = 0; i < this.length; i++) {
            this.molecules[i].excludeOclid(oclid);
        }
    }

    substructureSearch(query, limit) {
        const searcher = this._searcher || (this._searcher = new SSSearcher());
        let needReset = false;
        let mw;
        if (!query.isFragment()) {
            mw = query.getMolecularFormula().getRelativeWeight();
            query.setFragment(true);
            needReset = true;
        } else {
            mw = getMW(query);
        }
        searcher.setFragment(query);

        const index = query.getIndex();
        var i, molecule;

        mol: for (i = 0; i < this.length; i++) {
            molecule = this.molecules[i];
            if (molecule.dist !== MAX_DISTANCE) {
                for (var j = 0; j < 16; j++) {
                    if ((index[j]&this.index[i * 16 + j]) !== index[j]) {
                        molecule.dist = MAX_DISTANCE;
                        continue mol;
                    }
                }
                molecule.dist = Math.abs(this.molecules[i].mw - mw);
            }
        }
        sort(this.molecules, Molecule.compareDistance);
        this.sorted = false;

        var found = 0;
        for (i = 0; i < this.length; i++) {
            if (this.molecules[i].dist === MAX_DISTANCE || found === limit) {
                break;
            }

            // actual SSS
            searcher.setMolecule(OCLMolecule.fromIDCode(this.molecules[i].oclid));
            if (!searcher.isFragmentInMolecule()) {
                this.molecules[i].dist = MAX_DISTANCE;
            } else {
                found++;
            }
        }

        if (needReset) {
            query.setFragment(false);
        }
    }

    similaritySearch(query) {
        let mw;
        if (query.isFragment()) {
            mw = getMW(query);
        } else {
            mw = query.getMolecularFormula().getRelativeWeight();
        }
        const index = query.getIndex();
        const oclid = query.getIDCode();

        var sim, sharedKeys, allKeys;
        for (var i = 0; i < this.length; i++) {
            if (this.molecules[i].dist === MAX_DISTANCE) {
                continue;
            } else if (this.molecules[i].oclid === oclid) {
                sim = 0;
            } else {
                sharedKeys = 0;
                allKeys = 0;
                for (var j = 0; j < 16; j++) {
                    sharedKeys += bitCount(this.index[i * 16 + j]&index[j]);
                    allKeys += bitCount(this.index[i * 16 + j]|index[j]);
                }
                sim = 1e6 * (1 - (sharedKeys / allKeys));
            }

            this.molecules[i].dist = (Math.abs(mw - this.molecules[i].mw) + sim);
        }
    }
}

module.exports = CRDB;

function getMW(molecule) {
    // use a copy because setFragment(false) is not reversible (see https://github.com/Actelion/openchemlib/issues/4)
    let copy = OCLMolecule.fromIDCode(molecule.getIDCode());
    copy.setFragment(false);
    return copy.getMolecularFormula().getRelativeWeight();
}

function bitCount(x) {
    var temp = 0x55555555;
    x = (x & temp) + (x >>> 1 & temp);
    temp = 0x33333333;
    x = (x & temp) + (x >>> 2 & temp);
    temp = 0x07070707;
    x = (x & temp) + (x >>> 4 & temp);
    temp = 0x000F000F;
    x = (x & temp) + (x >>> 8 & temp);
    return (x & 0x1F) + (x >>> 16);
}
