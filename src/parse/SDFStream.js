'use strict';

const Transform = require('stream').Transform;
const sdfParser = require('sdf-parser');

class SDFStream extends Transform {
    constructor() {
        super({objectMode: true});
        this._buffer = '';
    }

    _transform(chunk, encoding, callback) {
        const str = chunk.toString();
        const delimiterIndex = str.lastIndexOf('$$$$\n');
        if (~delimiterIndex) {
            this._buffer += str.slice(0, delimiterIndex + 5);

            const parsed = sdfParser(this._buffer.replace(/\r/g,''));
            for (let i = 0; i < parsed.molecules.length; i++) {
                this.push(parsed.molecules[i]);
            }

            this._buffer = str.slice(delimiterIndex + 5);
        } else {
            this._buffer += str;
        }
        callback();
    }

    _flush(callback) {
        const parsed = sdfParser(this._buffer);
        for (let i = 0; i < parsed.molecules.length; i++) {
            this.push(parsed.molecules[i]);
        }
        callback();
    }
}

module.exports = function () {
    return new SDFStream();
};
