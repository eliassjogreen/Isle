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

               This is the only part that requires node js.
*/

"use strict";
if (typeof window !== 'undefined') {
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

function importLib(env, lib, defaultdir) {
    var extension = lib.match(/\.[0-9a-zA-Z$#&+@!()-{}'`_~, ]+$/i);

    if (!defaultdir.endsWith('\\' || '/')) {
        defaultdir += '\\'
    }

    if (extension == null || extension !== (".js" || ".isle")) {
        extension = ".js";
        lib = lib + extension;
    } else {
        extension = extension[0];
    }
    var path = /^[a-z]:((\/|(\\?))[\w .]+)+\.(js|isle)$/i.test(lib);

    let library;
    if (path && extension == ".js") {
        library = require(lib);
    } else if (!path && extension == ".js") {
        lib = defaultdir + lib;
        library = require(lib);
        addDefs(library);
    }

    function addDefs(library) {
        let functions = library.functions();
        for (let key in functions) {
            if (functions.hasOwnProperty(key)) {
                env.extend();
                env.def(key, functions[key]);
            }
        }
    }
}

module.exports = {
    importLib: importLib
};
