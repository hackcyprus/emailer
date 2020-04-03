const ora = require('ora')
const juice = require('juice')
const Handlebars = require('handlebars')
const sendGmail = require('gmail-send')

const campaigns = require('./emails')

function exitWithError(errorDescription) {
    console.error(`\n${errorDescription}`)
    process.exit()
}

function createSpinner() {
    const spinner = ora('Loading campaigns').start();
    spinner.color = 'yellow'
    return spinner
}

function spinnerProgress(spinner, current, total, description) {
    spinner.text = `[${current}/${total}] ${description}`
}

function sendEmailsByCampaign(campaign, emails) {
    const emailCount = emails.length
    const campaignEmails = campaigns[campaign]
    if ([campaign,emails].includes(undefined)) {
        exitWithError("One of the parameters passed was invalid")
    }

    const spinner = createSpinner()

    if (campaignEmails == undefined) {
        exitWithError("Campaign not found")
    }

    let emailsByCampaign = campaignEmails.map((campaign, campaignIndex) => transformCampaign(emails, campaign, campaignIndex))

    emailsByCampaign.forEach(campaignEmails => {
        campaignEmails.forEach(emailDetails => {
            processEmail(emailDetails)
        })

    })

    spinner.text = ``
}

function transformCampaign(emails, campaign, campaignIndex) {
    const template = generateCampaignTemplate(campaign.info())
    return emails.map((email, emailIndex) => {
        return transformCampainEmail(template, campaign, email, emailIndex)
    })
}

function generateCampaignTemplate({ template, stylesheet = "" }) {
    var source = juice(`<style>${stylesheet}</style>${template}`)
    return Handlebars.compile(source);
}

function transformCampainEmail(template, campaign, email, emailIndex) {
    const { subject, data = {} } = campaign.transformer(emailIndex, email)
    const emailBody = template(data)

    return {
        email,
        subject,
        body: emailBody
    }
}

function processEmail(emailDetails) {
    const send = sendGmail({
        user: process.env.EMAILER_EMAIL,
        pass: process.env.EMAILER_PASSWORD,
    })

    send({
        to: emailDetails.email,
        subject: emailDetails.subject,
        html: emailDetails.body
    })
}

// sendEmailsByCampaign("hackthecrisis", [])
