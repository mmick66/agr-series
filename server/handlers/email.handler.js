const Validator = require("email-validator");

module.exports = (apiURL, apiKey, listID) => { // Factory method

    return  async (request, h) => {

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

            return h.response('Created').code(201);

        } catch (e) {

            const { res, payload } = await Wreck.get(membersURL, {
                headers: headers
            });

            const listObject = JSON.parse(payload);
            const filtered = listObject.members.filter( (element) => element.email_address === email);
            if (filtered.length > 0) {
                return h.response('Duplicate email').code(409);
            }

            return h.response('Error in request').code(400);
        }

    };
};

