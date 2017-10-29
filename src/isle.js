/*
         ___
        /. _\
.--.|/_/__
  ''.--o/___  \
/.'o|_o  '.|
  |/   |_|   '
  '    |_|
         |_|
      __.|_|.__
     /   |_|   ``""-..__
    .    |_| (¯)__|¯|___'-._
    |   ´"'"`|¯(_-< / -_)   \
    \        |_/__/_\___|   |
     '-.__.--._          .-'
               `--...--'`
*/

"use strict";

if (typeof window !== 'undefined') {
    // From https://stackoverflow.com/a/19625245
    function require(url) {
        if (url.toLowerCase().substr(-3) !== '.js') url += '.js'; // to allow loading without js suffix;
        if (!require.cache) require.cache = []; //init cache
        var exports = require.cache[url]; //get from cache
        if (!exports) { //not cached
            try {
                exports = {};
                var X = new XMLHttpRequest();
                X.open("GET", url, 0); // sync
                X.send();
                if (X.status && X.status !== 200) throw new Error(X.statusText);
                var source = X.responseText;
                // fix (if saved form for Chrome Dev Tools)
                if (source.substr(0, 10) === "(function(") {
                    var moduleStart = source.indexOf('{');
                    var moduleEnd = source.lastIndexOf('})');
                    var CDTcomment = source.indexOf('//@ ');
                    if (CDTcomment > -1 && CDTcomment < moduleStart + 6) moduleStart = source.indexOf('\n', CDTcomment);
                    source = source.slice(moduleStart + 1, moduleEnd - 1);
                }
                // fix, add comment to show source on Chrome Dev Tools
                source = "//@ sourceURL=" + window.location.origin + url + "\n" + source;
                //------
                var module = {
                    id: url,
                    uri: url,
                    exports: exports
                }; //according to node.js modules
                var anonFn = new Function("require", "exports", "module", source); //create a Fn with module code, and 3 params: require, exports & module
                anonFn(require, exports, module); // call the Fn, Execute the module
                require.cache[url] = exports = module.exports; //cache obj exported by module
            } catch (err) {
                throw new Error("Error loading module " + url + ": " + err);
            }
        }
        return exports; //require returns object exported by module
    }

}

const env    = require('./env.js');
const input  = require('./input.js');
const lexer  = require('./lexer.js');
const parser = require('./parser.js');
const evaluate = require('./eval.js');
const Import = require('./import.js');

(function() {
    var isle = class isle {
        constructor(environment = new env.environment()) {
            this.environment = environment;
        }

        static interpret(code) {
            this.inputStream = new input.stream(code);
            this.lexer = new lexer.stream(this.inputStream);
            this.ast = parser.parse(this.lexer);
            evaluate.evaluate(this.ast, this.environment, function (result) {
                return result;
            });
        }
    }

    if (typeof window !== 'undefined') {
        window.isle = isle;
    } else {
        module.exports = isle;
    }
})();
