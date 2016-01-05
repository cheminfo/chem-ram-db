'use strict';

const IOBuffer = require('iobuffer');
const Molecule = require('openchemlib').Molecule;
const types = require('./types');
const defaultFields = require('./writerDefaultFields');
const writeData = require('./writeData');

const VERSION = require('./v2').VERSION;

class CrdWriter extends IOBuffer {
    constructor(options) {
        super();

        options = options || {};
        let fields = options.fields || [];

        if (options.includeDefaultFields === undefined) {
            options.includeDefaultFields = true;
        }

        let chosenDefaults = [];
        if (Array.isArray(options.includeDefaultFields)) {
            chosenDefaults = defaultFields.filter(function (field) {
                return options.includeDefaultFields.indexOf(field.name) >= 0;
            });
        } else if (options.includeDefaultFields) {
            chosenDefaults = defaultFields;
        }

        this.fields = validateFields(chosenDefaults.concat(fields));

        this.chosenDefaults = {};
        chosenDefaults.forEach(field => this.chosenDefaults[field.name] = true);

        this.writeUint16(VERSION); // binary format version
        this.writeUint16(this.fields.length); // number of fields
        this.writeFieldDefinitions();
        this._sizeOffset = this.offset;
        this.writeUint32(0); // we will put the size here but it is currently unknown

        // prepare insertion of molecule information
        this._writtenFields = new Map();
        this._total = 0;
        this._writtenMolecule = false;
    }

    writeMolfile(molfile) {
        const molecule = Molecule.fromMolfile(molfile);
        this.writeMolecule(molecule);
    }

    writeMolecule(molecule) {
        if (this._writtenMolecule) {
            throw new Error('some fields were not written for previous molecule');
        }

        const oclid = molecule.getIDCode();
        this.writeUint16(oclid.length);
        this.writeChars(oclid);

        const index = molecule.getIndex();
        for (var i = 0; i < 16; i++) {
            this.writeUint32(index[i]);
        }

        const mf = molecule.getMolecularFormula();
        this.writeFloat32(mf.getRelativeWeight());

        this._writtenMolecule = true;

        if (this.chosenDefaults.em) {
            this.writeField('em', mf.getAbsoluteWeight());
        }

        const props = molecule.getProperties();
        if (this.chosenDefaults.logp) {
            this.writeField('logp', props.getLogP());
        }
        if (this.chosenDefaults.logs) {
            this.writeField('logs', props.getLogS());
        }
        if (this.chosenDefaults.psa) {
            this.writeField('psa', props.getPolarSurfaceArea());
        }
        if (this.chosenDefaults.acc) {
            this.writeField('acc', props.getAcceptorCount());
        }
        if (this.chosenDefaults.don) {
            this.writeField('don', props.getDonorCount());
        }
        if (this.chosenDefaults.rot) {
            this.writeField('rot', props.getRotatableBondCount());
        }
        if (this.chosenDefaults.ste) {
            this.writeField('ste', props.getStereoCenterCount());
        }

        this._checkEndFields();
    }

    writeField(name, data) {
        if (!this._writtenMolecule) {
            throw new Error('you need to write the molecule before the fields');
        }
        if (this._writtenFields.has(name)) {
            throw new Error(`field ${name} already set`);
        }
        this._writtenFields.set(name, data);
        this._checkEndFields();
    }

    _checkEndFields() {
        if (this._writtenFields.size === this.fields.length) {
            // actually write field data in the record
            for (const field of this.fields) {
                writeData(this, field, this._writtenFields.get(field.name));
            }
            this._writtenFields.clear();
            this._writtenMolecule = false;
            this._total++;
        }
    }

    writeFieldDefinitions() {
        for (var i = 0; i < this.fields.length; i++) {
            this.writeFieldDefinition(this.fields[i]);
        }
    }

    writeFieldDefinition(field) {
        this.writeUint8(field.type);
        this.writeUint8(field.length);
        this.writeUint8(field.name.length);
        this.writeChars(field.name);
    }

    finish() {
        this.mark();
        this.seek(this._sizeOffset);
        this.writeUint32(this._total);
        this.reset();
    }
}

module.exports = CrdWriter;

function validateFields(fields) {
    for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (!types.exists(field.type)) {
            throw new Error(`field type ${field.type} does not exist`);
        }
        if (typeof field.type === 'number') {
            field.type = types.list[field.type];
        }
        if (typeof field.length !== 'number') {
            field.length = 1;
        }
        if (field.length < 0 || field.length > 255) {
            throw new Error('field length must be a number in the range 0-255');
        }
        if (typeof field.name !== 'string') {
            throw new Error('field name must be a string');
        }
    }
    return fields;
}
