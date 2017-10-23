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


/**
 * stream (lexer.stream) - The lexer
 *
 * @param  {object} input - Takes input stream as input
 * @return {object} Returns lexer functions for parser
 */
function stream(input) {
    /** The current token */
    var current = null;

    /** All of the keywords */
    var keywords = ["function", "return", "if", "else", "else", "true", "false"];

    /** The punctuation characters */
    var puncCh = ",;(){}[]";

	/** The operator characters */
    var opCh = "+-*/%=&|<>!";

	/** The id alpha characters */
    var idAlpha = ".?!-<>=0123456789";

	/** The comment character, multiline starts with two comment characters and ends with one comment character */
    var comment = "#";

	/** The escape character */
    var escape = "\\";

	/** The character to start and end strings */
    var qoute = '"';

	/** The character that indicates a decimal number */
    var decimal = ".";

    return {
        next,
        peek,
        eof,
        croak: input.croak
    };

    /* Predicates */

    /**
     * isKw - Checks if param is a keyword
     *
     * @param  {string} w - input character
     * @return {boolean} Returns true if param w is in keywords array
     */
    function isKw(w) {
        return keywords.indexOf(w) >= 0;
    }

    /**
     * isDigit - Tests with regex if param ch is number
     *
     * @param  {string} ch - input character
     * @return {boolean} Returns true if test returns true
     */
    function isDigit(ch) {
        return /\d/i.test(ch);
    }

    /**
     * isIdStart - Checks if param ch is any character between a-z in lowercase or capital or underscore
     *
     * @param  {string} ch - input character
     * @return {boolean} Returns true if param ch is any of these characters: abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_
     */
    function isIdStart(ch) {
        return /[a-zA-Z_]/i.test(ch);
    }

    /**
     * isId - Checks if param ch is any of the alpha characters or isIdStart
     *
     * @param  {string} ch - input character
     * @return {boolean} Returns true if param ch is either isIdStart or idAlpha
     */
    function isId(ch) {
        return isIdStart(ch) || idAlpha.indexOf(ch) >= 0;
    }

    /**
     * isOpCh - Checks if param ch is any of the operator characters
     *
     * @param  {string} ch - input character
     * @return {boolean} Returns true if param ch is any of these characters: +-/*%=&|<>!
     */
    function isOpCh(ch) {
        return opCh.indexOf(ch) >= 0;
    }

    /**
     * isPunc - Checks if param ch is any of the punctuation characters
     *
     * @param  {string} ch - input character
     * @return {boolean} Returns true if param ch is any of these characters: ,;(){}[]
     */
    function isPunc(ch) {
        return puncCh.indexOf(ch) >= 0;
    }


    /**
     * isWhitespace - Checks if param ch is any whitespace character
     *
     * @param  {string} ch - input character
     * @return {boolean} Returns true if ch is any whitespace character
     */
    function isWhitespace(ch) {
        return /\s/.test(ch);
    }

    /* Predicates */


    /**
     * readWhile - Returns string when predicate returns false
     *
     * @param  {Function} predicate - funtion that returns boolean and takes a character as input
     * @return {string} Returns string when predicate returns false
     */
    function readWhile(predicate) {
        var str = "";
        while (!input.eof() && predicate(input.peek()))
            str += input.next();
        return str;
    }


    /**
     * readNumber - Reads unsigned numbers
     *
     * @return {object} Returns a token
     */
    function readNumber() {
        var dot = false;
        const number = readWhile(ch => {
            if (ch === decimal) {
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


    /**
     * readIdent - Reads variable names and keywords
     *
     * @return {object} returns a token
     */
    function readIdent() {
        const id = readWhile(isId);
        return {
            type: isKw(id) ? "kw" : "var",
            value: id,
        };
    }


    /**
     * readEscaped - Reads escaped characters
     *
     * @param  {string} end - End character
     * @return {string} Returns all characters until the escaped characters
     */
    function readEscaped(end) {
        var escaped = false,
            str = "";
        input.next();
        while (!input.eof()) {
            var ch = input.next();
            if (escaped) {
                str += ch;
                escaped = false;
            } else if (ch === escape) {
                escaped = true;
            } else if (ch === end) {
                break;
            } else {
                str += ch;
            }
        }
        return str;
    }


    /**
     * readString - Reads everything within double qoutes
     *
     * @return {object} Returns token
     */
    function readString() {
        return {
            type: "str",
            value: readEscaped(qoute)
        };
    }


    /**
     * skipComment - skips single line comments
     */
    function skipComment() {
        readWhile(function(ch) {
            return ch !== ("\n");
        });
        input.next();
    }

    /**
     * skipCommentMultiline - skips multiline comments
     */
    function skipCommentMultiline() {
        input.next();
        readWhile(function(ch) {
            return ch !== comment;
        });
        input.next();
    }


    /**
     * readNext - Reads next token by checking character and calling functions which handle the rest
     *
     * @return {object} Returns token
     */
    function readNext() {
        readWhile(isWhitespace);
        if (input.eof()) return null;
        var ch = input.peek();
        if (ch === comment) {
            input.next();
            if (input.peek() === comment) {
                skipCommentMultiline();
            } else {
                skipComment();
            }
            return readNext();
        }

        if (ch === qoute) return readString();
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

    /**
     * peek - Peeks on the next token
     *
     * @return {object} Returns token
     */
    function peek() {
        return current || (current = readNext());
    }

    /**
     * next - Goes to next token and returns it
     *
     * @return {object} Returns token
     */
    function next() {
        var tok = current;
        current = null;
        return tok || readNext();
    }

    /**
     * eof - Returns true if we have reached end of line (eof)
     *
     * @return {boolean} Returns true if the peek function returns null
     */
    function eof() {
        return peek() === null;
    }
}

module.exports = {
    stream: stream
};
