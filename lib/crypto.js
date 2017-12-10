this.functions = function() {
    return {
        "crypto.djb2": function(callback, string) {
            let hash = 5381;
            for (let i = 0; i < string.length; i++)
                hash = ((hash << 5) + hash) + string.charCodeAt(i);
            callback(hash >>> 0);
        },
        "crypto.djb2a": function(callback, string) {
            let hash = 5381;
            for (let i = 0; i < string.length; i++)
                hash = hash * 33 ^ string.charCodeAt(i);
            callback(hash >>> 0);
        },
        "crypto.sdbm": function(callback, string) {
            let hash = 0;
            for (let i = 0; i < string.length; i++) {
                hash = string.charCodeAt(i) + (hash << 6) + (hash << 16) - hash;
            }
            callback(hash);
        },
        "crypto.loselose": function(callback, string) {
            let hash = 0;
            for (let i = 0; i < string.length; i++) {
                char = string.charCodeAt(i);
                hash += char;
            }
            callback(hash);
        },
        "crypto.fnv1": function(callback, string, fnvPrime = 1099511628211, fnvOffset = 14695981039346656037) {
            let hash = fnvOffset;
            for (let i = 0; i < string.length; i++) {
                hash *= fnvPrime;
                hash ^= string.charCodeAt(i);
            }
            callback(hash >>> 0);
        },
        "crypto.fnv1a": function(callback, string, fnvPrime = 1099511628211, fnvOffset = 14695981039346656037) {
            let hash = fnvOffset;
            for (let i = 0; i < string.length; i++) {
                hash ^= string.charCodeAt(i);
                hash *= fnvPrime;
            }
            callback(hash >>> 0);
        },
        "crypto.adler32": function(callback, string) {
            let a = 1,
                b = 0;

            for (let i = 0; i < string.length; i++) {
                a = (a + string.charCodeAt(i) % 65521);
                b = (b + a) % 65521;
            }
            callback((b << 16) | a);
        },
        "crypto.fletcher16": function(callback, string) {
            let a = 0,
                b = 0;
            for (let i = 0; i < string.length; i++) {
                a = (a + string.charCodeAt(i)) % 255;
                b = (b + a) % 255;
            }
            callback((b << 8) | a);
        },
        "crypto.caesarShift": function (callback, string, shift) {
            let out = '';

            for (let i = 0; i < string.length; i++) {
                let c = string.charAt(i);
                if (c.match(/[a-z]/i)) {
                    let code = string.charCodeAt(i);
                    if ((code >= 65) && (code <= 90)) c = String.fromCharCode(((code - 65 + shift) % 26) + 65);
                    else if ((code >= 97) && (code <= 122)) c = String.fromCharCode(((code - 97 + shift) % 26) + 97);
                }
                out += c;
            }
            callback(out);
        }
    }
}
