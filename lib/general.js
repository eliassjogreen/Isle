this.functions = function () {
    return {
        print : function (callback, text) {
            text = text.toString();
            process.stdout.write(text);
            callback(false);
        },
        println : function (callback, text) {
            text = text.toString();
            process.stdout.write(text + "\n");
            callback(false);
        }
    }
}