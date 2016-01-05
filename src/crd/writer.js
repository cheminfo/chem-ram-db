'use strict';

const IOBuffer = require('iobuffer');
const types = require('./types');
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

        validateFields(fields);

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
        this.writeUint8(field.type);
        this.writeUint8(field.length);
        this.writeUint8(field.name.length);
        this.writeChars(field.name);
    }
}

module.exports = CrdWriter;

function validateFields(fields) {
    for (var i = 0; i < fields.length; i++) {
        const field = fields[i];
        if (!types.exists(field.type)) {
            throw new Error(`field type ${field.type} does not exist`);
        }
        if (typeof field.length !== 'number' || field.length < 0 || field.length > 255) {
            throw new Error('field length must be a number in the range 0-255');
        }
        if (typeof field.name !== 'string') {
            throw new Error('field name must be a string');
        }
    }
}
