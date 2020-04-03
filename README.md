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
- `npm run email:campaign -- --campaign=nameOfCampaign --emails=nameOfEmailsFile`
