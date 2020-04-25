const { loadEmailAsset } = require("../../../utils/fs")
const jurors = require("./data")

function emailAsset(name) {
    return loadEmailAsset(`euvsvirus/final/${name}`)
}

function transformer(index, email) {
    const juror = jurors[email]
    
    return {
        subject: "[Action Required] Your juror application status",
        data: {
            jurorId: juror.id,
            jurorFirstName: juror.firstName,
            jurorLastName: juror.lastName,
            domain: juror.domain,
            challenge: juror.challenge
        }
    }
}

function info() {
    const template = emailAsset("template.hbs")

    return {
        template
    }
}

module.exports = {
    transformer,
    info
}
