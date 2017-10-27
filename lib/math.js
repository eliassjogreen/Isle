this.functions = function () {
    return {
        "math.e": function (callback) {
            callback(Math.E);
        },
        "math.ln2": function (callback) {
            callback(Math.LN2);
        },
        "math.ln10": function (callback) {
            callback(Math.LN10);
        },
        "math.log2e": function (callback) {
            callback(Math.LOG2E);
        },
        "math.pi": function (callback) {
            callback(Math.PI);
        },
        "math.sqrt1_2": function (callback) {
            callback(Math.SQRT1_2);
        },
        "math.sqrt2": function (callback) {
            callback(Math.SQRT2);
        },
        "math.abs": function (callback, x) {
            callback(Math.abs(x));
        },
        "math.acos": function (callback, x) {
            callback(Math.acos(x));
        },
        "math.acosh": function (callback, x) {
            callback(Math.acosh(x));
        },
        "math.asin": function (callback, x) {
            callback(Math.asin(x));
        },
        "math.asinh": function (callback, x) {
            callback(Math.asinh(x));
        },
        "math.atan": function (callback, x) {
            callback(Math.atan(x));
        },
        "math.atanh": function (callback, x) {
            callback(Math.atanh(x));
        },
        "math.atan2": function (callback, x) {
            callback(Math.atan2(x));
        },
        "math.cbrt": function (callback, x) {
            callback(Math.cbrt(x));
        },
        "math.ceil": function (callback, x) {
            callback(Math.ceil(x));
        },
        "math.clz32": function (callback, x) {
            callback(Math.clz32(x));
        },
        "math.cos": function (callback, x) {
            callback(Math.cos(x));
        },
        "math.cosh": function (callback, x) {
            callback(Math.cosh(x));
        },
        "math.exp": function (callback, x) {
            callback(Math.exp(x));
        },
        "math.expm1": function (callback, x) {
            callback(Math.expm1(x));
        },
        "math.floor": function (callback, x) {
            callback(Math.floor(x));
        },
        "math.fround": function (callback, x) {
            callback(Math.fround(x));
        },
        "math.log": function (callback, x) {
            callback(Math.log(x));
        },
        "math.log1p": function (callback, x) {
            callback(Math.log1p(x));
        },
        "math.log10": function (callback, x) {
            callback(Math.log10(x));
        },
        "math.pow": function (callback, x, y) {
            callback(Math.pow(x, y));
        },
        "math.random": function (callback) {
            callback(Math.random());
        },
        "math.round": function (callback, x) {
            callback(Math.round(x));
        },
        "math.sign": function (callback, x) {
            callback(Math.sign(x));
        },
        "math.sin": function (callback, x) {
            callback(Math.sin(x));
        },
        "math.sinh": function (callback, x) {
            callback(Math.sinh(x));
        },
        "math.sqrt": function (callback, x) {
            callback(Math.sqrt(x));
        },
        "math.tan": function (callback, x) {
            callback(Math.tan(x));
        },
        "math.tanh": function (callback, x) {
            callback(Math.tanh(x));
        },
        "math.trunc": function (callback, x) {
            callback(Math.trunc(x));
        },
    }
}
