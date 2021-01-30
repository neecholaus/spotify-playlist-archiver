function log(text, group=null) {
    console.log((group ? `[${group}]` : '') + ' ' + text);
}

module.exports = {
    log
}