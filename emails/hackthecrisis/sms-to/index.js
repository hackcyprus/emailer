const { loadEmailAsset } = require("../../../utils/fs")

function smsToAsset(name) {
    return loadEmailAsset(`hackthecrisis/sms-to/${name}`)
}

function transformer(index, email) {
    return {
        subject: "HackTheCrisis: Your Goody bag from SMS.to!"
    }
}

function info() {
    const template = smsToAsset("template.hbs")
    const stylesheet = smsToAsset("style.css")

    return {
        template,
        stylesheet
    }
}

module.exports = {
    transformer,
    info
}
