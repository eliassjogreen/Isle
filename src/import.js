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

if (typeof window === 'undefined' && typeof window.document === 'undefined') {

    const fs = require('fs');

    var importLib = function(env, lib) {
        var extension = lib.match(/\.[0-9a-zA-Z$#&+@!()-{}'`_~, ]+$/i);
        if (extension == null || extension !== (".js" || ".isle")) {
            extension = ".js";
            lib = lib + extension;
        } else {
            extension = extension[0];
        }
        var path = /^[a-z]:((\/|(\\?))[\w .]+)+\.(js|isle)$/i.test(lib);
        if (path && extension == ".js") {
            if (fileExists(lib)) {
                var library = require(lib);
                addDefs(library);
            }
        } else if (!path && extension == ".js") {
            if (fileExists(__dirname + "\\lib\\" + lib)) {
                lib = __dirname + "\\lib\\" + lib;
                var library = require(lib);
                addDefs(library);
            } else if (fileExists(process.argv[2] + "\\" + lib)) {
                lib = process.argv[2] + "\\" + lib;
                var library = require(lib);
                addDefs(library);
            }
        }

        function addDefs(library) {
            var functions = library.functions();
            for (var key in functions) {
                if (functions.hasOwnProperty(key)) {
                    env = env.extend();
                    env.def(key, functions[key]);
                }
            }
        }

        function fileExists(file) {
            try {
                return fs.statSync(file).isFile();
            } catch (err) {
                return false;
            }
        }
    }
} else {
    throw new Error("import function is not yet implemented in browser");
}