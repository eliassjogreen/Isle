this.functions = function () {
    return {
        print : function (callback, text) {
            process.stdout.write(text);
            callback = false;
        },
        println : function (callback, text) {
            process.stdout.write(text + "\n");
            callback = false;
        }
    }
}
