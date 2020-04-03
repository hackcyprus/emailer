var fs = require('fs');
var path = require('path')

function loadEmailAsset(name) {
    let templatePath = path.join(__dirname, '..', 'emails', name)
    return fs.readFileSync(templatePath, 'utf8')
}

module.exports = {
    loadEmailAsset
}
