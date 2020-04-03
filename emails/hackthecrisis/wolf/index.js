const { loadEmailAsset } = require("../../../utils/fs")
const coupons = require("./data")

function wolfAsset(name) {
    return  loadEmailAsset(`hackthecrisis/wolf/${name}`)
}

function transformer(index, email) {
    const coupon = coupons[index]

    return {
        subject: "HackTheCrisis: Your Goody bag from Wolf!",
        data: {
            coupon
        }
    }
}

function info() {
    const template = wolfAsset("template.hbs")
    const stylesheet = wolfAsset("style.css")

    return {
        template,
        stylesheet
    }
}

module.exports = {
    transformer,
    info
}
