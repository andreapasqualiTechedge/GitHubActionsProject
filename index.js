'use strict';

const Hapi = require('@hapi/hapi');
const Boom = require('@hapi/boom');
const axios = require('axios');

// Start the server
async function start() {
    let cors = {
        origin: ["*"],
        additionalHeaders: [
            'Access-Control-Allow-Origin',
            'Access-Control-Request-Method',
            'Allow-Origin',
            'Origin',
            'access-control-allow-origin',
            'access-control-request-method',
            'allow-origin',
            'origin',
            'access-control-allow-headers',
            'authorization',
        ]
    };

    // Create a server with a host and port
    const server = Hapi.server({
        host: '0.0.0.0',
        port: 8000,
        routes: {
            cors: cors,
            validate: {
                failAction: async (request, h, err) => {
                    throw Boom.badRequest(err.message);
                }
            }
        }
    });

    server.route({
        method: 'GET',
        path: '/callBoredApi',
        config: {
            description: 'Call bored api endpoint',
            auth: false
        },
        handler: async (request, h) => {
            return await callBoredApi(request.query.name)
        }
    });

    // Start server
    try {
        await server.start();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }

    console.log('Hapi Server running at:', server.info.uri);
    return server;
}

async function callBoredApi(name) {

    let response;

    try {
        response = await axios({
            method: 'get',
            url: 'https://www.boredapi.com/api/activity'
        });
    }
    catch (e) {
        return e;
    }

    return "Hi "+name+"! you should "+response.data.activity+" today :)";
}

start()