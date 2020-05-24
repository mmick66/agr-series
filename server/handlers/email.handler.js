const Validator = require("email-validator");
const Wreck = require('@hapi/wreck');

const PDF_FILE_NAME = './static/sample.pdf';


module.exports = (apiURL, apiKey, listID) => { // Factory method


    return  async (request, h) => {

        let cache = request.server.app.redis;

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

        const membersURL = `${apiURL}/lists/${listID}/members/`;

        try {
            const { res } = await Wreck.post(membersURL, {
                payload: payload,
                headers: headers
            });

            await cache.setAsync(email, true);

            return h.file(PDF_FILE_NAME);

        } catch (e) {

            /* -- Fast path -- */
            const emailCached = await cache.getAsync(email);
            if (emailCached) {
                return h.file(PDF_FILE_NAME);
            }

            /* -- Slow path -- */
            const { res, payload } = await Wreck.get(membersURL, {
                headers: headers,
                json: true
            });

            for (const m of payload.members) {
                const memberEmail = m.email_address;
                if (memberEmail === email) {
                    await cache.setAsync(memberEmail, true);
                    return h.file(PDF_FILE_NAME);
                }
            }

            if (found) {
                return h.file(PDF_FILE_NAME);
            }

            return h.response('Error in request').code(400);

        }

    };
};

