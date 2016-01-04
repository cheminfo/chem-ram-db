'use strict';

const MAX_DISTANCE = 0xffffffff;

class Molecule {
    constructor(oclid, mw, sortid) {
        this.oclid = oclid;
        this.mw = mw;
        this.sortid = sortid;
        this.dist = 0;
    }

    excludeOclid(oclid) {
        if (this.dist !== MAX_DISTANCE && this.oclid !== oclid) {
            this.dist = MAX_DISTANCE;
        }
    }
}

Molecule.MAX_DISTANCE = MAX_DISTANCE;

Molecule.compareId = (mol1, mol2) => mol1.sortid - mol2.sortid;
Molecule.compareDistance = (mol1, mol2) => mol1.dist - mol2.dist;

module.exports = Molecule;
