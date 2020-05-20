'use strict';

const API_URL = 'https://us18.api.mailchimp.com/3.0';
const LIST_ID = 'dee953cf76';

const Hapi = require('@hapi/hapi');
const Wreck = require('@hapi/wreck');
const Validator = require("email-validator");

const init = async (apiKey) => {

    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    server.route({
        method: 'POST',
        path: '/email',
        handler: async (request, h) => {

            let postData = request.payload;
            if (!postData) {
                return h.response('No data received in the body of this request').code(400);
            }

            let email = postData['email'];
            if (!email) {
                return h.response('No data received in the body of this request').code(400);
            }

            if(!Validator.validate(email)) {
                return h.response('The data sent is not an email').code(400);
            }

            const headers = {
                'Authorization': 'apikey ' + apiKey,
                'Content-Type': 'application/json'
            };

            const payload = {
                'email_address': email,
                'status': 'subscribed',
                'merge_fields': {
                    'FNAME': '',
                    'LNAME': ''
                }
            };

            try {
                const { res } = await Wreck.post(`${API_URL}/lists/${LIST_ID}/members/`, {
                    payload: payload,
                    headers: headers
                });

                return h.response('Created').code(201);

            } catch (e) {

                const { res, payload } = await Wreck.get(`${API_URL}/lists/${LIST_ID}/members/`, {
                    headers: headers
                });

                const listObject = JSON.parse(payload);
                const filtered = listObject.members.filter( (element) => element.email_address === email);
                if (filtered.length > 0) {
                    return h.response('Duplicate email').code(409);
                }

                return h.response('Error in request').code(400);
            }

        }
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

const apiKey = process.env.MAILCHIMP_API_KEY;

if (!apiKey) {
    console.log('No API Key for the Mailchimp API has been set. Read README.md for more');
    process.exit(1);
}

init().then();
