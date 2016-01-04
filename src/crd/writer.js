'use strict';

const IOBuffer = require('iobuffer');
const defaultFields = require('./writerDefaultFields');

const VERSION = require('./v2').VERSION;

class CrdWriter extends IOBuffer {
    constructor(options) {
        super();

        options = options || {};
        let fields = options.fields || [];

        if (options.includeDefaultFields === undefined) {
            options.includeDefaultFields = true;
        }

        if (Array.isArray(options.includeDefaultFields)) {
            fields = fields.concat(defaultFields.filter(function (field) {
                return options.includeDefaultFields.indexOf(field.name) >= 0;
            }));
        } else if (options.includeDefaultFields) {
            fields = fields.concat(defaultFields);
        }

        this.fields = fields;

        this.writeUint16(VERSION); // binary format version
        this.writeUint16(this.fields.length); // number of fields
        this.writeFieldDefinitions();
        this.writeUint32(0); // todo write records
    }

    writeFieldDefinitions() {
        for (var i = 0; i < this.fields.length; i++) {
            this.writeFieldDefinition(this.fields[i]);
        }
    }

    writeFieldDefinition(field) {
        this.writeUint32(field.type);
        this.writeUint8(field.length);
        this.writeUint8(field.name.length);
        this.writeChars(field.name);
    }
}

module.exports = CrdWriter;
