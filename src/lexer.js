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

function stream(input) {
    var current = null;

    var keywords = ["function", "return", "if", "else", "else", "true", "false"];

    var puncCh = ",;(){}[]";
    var opCh = "+-*/%=&|<>!";
    var idAlpha = "?!-<>=0123456789";
    var comment = "#";

    return {
        next,
        peek,
        eof,
        croak: input.croak
    };

    /* Predicates */

    function isKw(w) {
        return keywords.indexOf(w) >= 0;
    }

    function isDigit(ch) {
        return /\d/i.test(ch);
    }

    function isIdStart(ch) {
        return /[a-zA-Z_]/i.test(ch);
    }

    function isId(ch) {
        return isIdStart(ch) || idAlpha.indexOf(ch) >= 0;
    }

    function isOpCh(ch) {
        return opCh.indexOf(ch) >= 0;
    }

    function isPunc(ch) {
        return puncCh.indexOf(ch) >= 0;
    }

    function isWhitespace(ch) {
        return /\s/.test(ch);
    }

    /* Predicates */

    function readWhile(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }

    function readNumber() {
        var dot = false;
        const number = readWhile(ch => {
            if (ch === ".") {
                if (dot) return false;
                dot = true;
                return true;
            }
            return isDigit(ch);
        });
        return {
            type: "num",
            value: parseFloat(number)
        };
    }

    function readIdent() {
        const id = readWhile(isId);
        return {
            type: isKw(id) ? "kw" : "var",
            value: id,
        };
    }

    function readEscaped(end) {
        var escaped = false,
            str = "";
        input.next();
        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch === "\\") {
                escaped = true;
            } else if (ch === end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }

    function readString() {
        return {
            type: "str",
            value: readEscaped('"')
        };
    }

    function skipComment() {
        readWhile(function(ch) {
            return ch !== ("\n");
        });
        input.next();
    }

    function skipCommentMultiline() {
        readWhile(function(ch) {
            return ch !== comment;
        });
        input.next();
    }

    function readNext() {
        readWhile(isWhitespace);
        if (input.eof()) return null;
        var ch = input.peek();
        if (ch === comment) {
            if (input.peek() === comment) {
                skipCommentMultiline();
            } else {
                skipComment();
            }
            return readNext();
        }

        if (ch === '"') return readString();
        if (isDigit(ch)) return readNumber();
        if (isIdStart(ch)) return readIdent();
        if (isPunc(ch)) return {
            type: "punc",
            value: input.next()
        };
        if (isOpCh(ch)) return {
            type: "op",
            value: readWhile(isOpCh)
        };
        input.croak("Can't handle character: " + ch);
    }

    function peek() {
        return current || (current = readNext());
    }

    function next() {
        var tok = current;
        current = null;
        return tok || readNext();
    }

    function eof() {
        return peek() === null;
    }
}

module.exports = {
    stream: stream
};
