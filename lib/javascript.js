this.functions = function() {
    return {
        "javascript.eval": function(callback, evalString) {
            callback(eval(evalString));
        }
    }
}
