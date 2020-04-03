require('dotenv').config()

const fs = require('fs')
const ora = require('ora')
const juice = require('juice')
const Handlebars = require('handlebars')
const sendGmail = require('gmail-send')
const batchPromises = require('batch-promises')
const argv = require('yargs').argv

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

function spinnerProgress(current, total, description) {
    return `[${current}/${total}] ${description}`
}

function sendEmailsByCampaign(campaign, emails) {
    const campaignEmails = campaigns[campaign]
    if ([campaign, emails].includes(undefined)) {
        exitWithError("One of the parameters passed was invalid")
    }

    const spinner = createSpinner()

    if (campaignEmails == undefined) {
        exitWithError("Campaign not found")
    }

    const gmailSender = loginToGmail()
    const emailsToSendOut = campaignEmails.flatMap((campaign, campaignIndex) => transformCampaign(emails, campaign, campaignIndex))
    const emailCount = emailsToSendOut.length

    batchPromises(2, emailsToSendOut, async email => {
        let index = emailsToSendOut.findIndex(item => item == email)
        spinner.text = spinnerProgress(index + 1, emailCount, `Email with subject ${email.subject}`)
        return processEmail(gmailSender, email)
    }).then(function () {
        spinner.color = 'green'
        spinner.text = "Finished processing emails. Wrapping things up.."

        setTimeout(() => {
            process.exit()
        }, 1000);
    })
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

function loginToGmail() {
    return sendGmail({
        user: process.env.EMAILER_EMAIL,
        pass: process.env.EMAILER_PASSWORD,
    })
}

async function processEmail(send, emailDetails) {
    try {
        await send({
            to: emailDetails.email,
            subject: emailDetails.subject,
            html: emailDetails.body
        })
    } catch (error) {
        print(`Failed sending email to: ${emailDetails.email} - ${emailDetails.body}`)
    }
}

var errored = false

if (!argv.campaign) {
    console.error(`"--campaign" property missing`)
    errored = true
}
if (!argv.emails) {
    console.error(`"--emails" property missing`)
    errored = true
}

if (!errored) {
    let emails = require(`./recipients/${argv.emails}.json`)
    sendEmailsByCampaign(argv.campaign, emails)
}
