'use strict';

const uint  = 0b1;
const int   = 0b10;
const float = 0b100;
const ascii = 0b1000;
const bit8  = 0b10000;
const bit16 = 0b100000;
const bit32 = 0b1000000;
const bit64 = 0b10000000;

module.exports = {
    uint8: uint|bit8,
    uint16: uint|bit16,
    uint32: uint|bit32,
    int8: int|bit8,
    int16: int|bit16,
    int32: int|bit32,
    float32: float|bit32,
    float64: float|bit64,
    ascii: ascii
};
