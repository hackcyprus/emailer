# hack{cyprus} emailer

The purpose of this project is to construct dynamic emails and send them to hack{cyprus} participants. 

It utilises the following technologies to aid in the development and distribution of emails:

1. handlebars for generating dynamic email content
2. juice.js for inlining those pesky html templates
3. gmail for distributing emails

## Sending emails

In order to send emails, make will need to:

- Copy `.env.example` to `.env` and add missing values
- Add the list of emails you would like to contact in `/recipients`. [Check /recipients Readme](/recipients)
- To send the whole campaign: `npm run email:campaign -- --campaign=nameOfCampaign --emails=nameOfEmailsFile`
- To send a single email: `npm run email:single -- --emailName=nameOfEmailWithFolderName --emails=nameOfEmailsFile`

**Examples:**

- Single email: `npm run email:single -- --emailName=hackthecrisis/wolf --emails=hackthecrisis-emails`
- Entire campaign: `npm run email:campaign -- --campaign=hackthecrisis --emails=hackthecrisis-emails`
