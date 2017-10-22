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
 *  The environment containing the variables and functions
 */
function environment(parent) {
    this.vars = Object.create(parent ? parent.vars : null);
    this.parent = parent;
}

environment.prototype = {

    /**
     * extend - Creates a subscope
     *
     * @return {object} Returns the new environment
     */
    extend: function() {
        return new environment(this);
    },


    /**
     * lookup - To find the scope where the variable with the given name is defined.
     *
     * @param  {string} name - The name of the variable
     * @return {object} Returns the scope
     */
    lookup: function(name) {
        let scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name)) {
                return scope;
            }
            scope = scope.parent;
        }
    },


    /**
     * get - To get the current value of a variable. Throws an error if the variable is not defined.
     *
     * @param  {string} name - The name of the variable
     * @return {object} Returns the variable
     */
    get: function(name) {
        if (name in this.vars) {
            return this.vars[name];
        }
        throw new Error(`Undefined variable ${name}`);
    },


    /**
     * set - to set the value of a variable. This needs to lookup the actual scope where the variable is defined. If it's not found and we're not in the global scope, throws an error.
     *
     * @param  {string} name  - Name of the variable to set the value of
     * @param  {*} value - Value of the variable
     * @return {object} Returns the variable
     */
    set: function(name, value) {
        const scope = this.lookup(name);
        if (!scope && this.parent) {
            throw new Error(`Undefined variable ${name}`);
        }
        return (scope || this).vars[name] = value;
    },


    /**
     * def - this creates (or shadows, or overwrites) a variable in the current scope
     *
     * @param  {string} name  - Name of the variable to be defined
     * @param  {*} value - Value of the variable to be defined
     * @return {object} Returns the variable
     */
    def: function(name, value) {
        return this.vars[name] = value;
    }
}

module.exports = {
    environment : environment
};
