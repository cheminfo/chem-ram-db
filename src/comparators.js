'use strict';

exports.eq = function (value) {
    return other => other === value;
};

exports.neq = function (value) {
    return other => other !== value;
};

exports.lt = function (value) {
    return other => other < value;
};

exports.lte = function (value) {
    return other => other <= value;
};

exports.gt = function (value) {
    return other => other > value;
};

exports.gte = function (value) {
    return other => other >= value;
};
