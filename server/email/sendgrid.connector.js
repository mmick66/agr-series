const sgMail = require('@sendgrid/mail');

class SendgridConnector {

    constructor(apiKey) {
        sgMail.setApiKey(apiKey);
    }

    async send(email) {

        const msg = {
            to: email,
            from: 'hello@agr-series.com',
            subject: 'Thank you for downloading',
            text: 'We will keep you up to date',
            html: '<strong>and easy to do anywhere, even with Node.js</strong>',
        };
        await sgMail.send(msg);
    }

}
