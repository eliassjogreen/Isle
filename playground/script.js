let loaded = false;
window.onload = function () {
    loaded = true;
}

function interpretCode() {
    let i = new isle();

    i.interpret(document.getElementById('editor').value);
}
