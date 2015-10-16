'use strict';

exports.eq = function (value) {
    return function (other) {
        return other === value;
    };
};

exports.neq = function (value) {
    return function (other) {
        return other !== value;
    };
};

exports.lt = function (value) {
    return function (other) {
        return other < value;
    };
};

exports.lte = function (value) {
    return function (other) {
        return other <= value;
    };
};

exports.gt = function (value) {
    return function (other) {
        return other > value;
    };
};

exports.gte = function (value) {
    return function (other) {
        return other >= value;
    };
};
