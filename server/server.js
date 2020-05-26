'use strict';

const API_URL = 'https://us18.api.mailchimp.com/3.0';
const LIST_ID = 'dee953cf76';

const Hapi = require('@hapi/hapi');

const redis = require("redis");
const promisify = require("util").promisify;


const start = async (MAILCHIMP_API_KEY) => {


    const server = Hapi.server({
        port: 3000,
        host: 'localhost'
    });

    const redisClient = redis.createClient({
            host: process.env.REDIS_HOST || '127.0.0.1',
            port: process.env.REDIS_PORT || 6379,
        }
    );

    redisClient.getAsync = promisify(redisClient.get).bind(redisClient);
    redisClient.setAsync = promisify(redisClient.set).bind(redisClient);

    server.route({
        method: 'POST',
        path: '/email',
        handler: require('./handlers/email.handler')(API_URL, MAILCHIMP_API_KEY, LIST_ID)
    });

    await server.register({
        plugin: require('hapi-cors'),
        options: {
            origins: [
                'http://localhost:63342',
                'http://agr-series.com:80'
            ]
        }
    });

    await server.register({
        plugin: require('@hapi/inert')
    });

    redisClient.on('error', function (err) {
        console.error('Redis error.', err);
    });

    server.app.redis = redisClient;

    await server.start();

    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit(1);
});

const MAILCHIMP_API_KEY = process.env.MAILCHIMP_API_KEY;

// const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;

if (!MAILCHIMP_API_KEY) {
    console.log('No API Key for the Mailchimp API has been set. Read README.md for more');
    process.exit(1);
}

start(MAILCHIMP_API_KEY).then();
