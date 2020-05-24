# AGR Landing Page
The main website for the AGR series channel

### Installation

The app comes in two components. The Botstrap landing page and the small server app that communicates with Mailchimp to save the email of subscribers.

The HTML landing page runs on a standard web server (like Apache).

The server.js app runs separately (PM2 recomended). It needs a **Redis process running** prior to start.

The server runs as a Node.js application and needs the proper environmental variables to run.


### Variables

The server app needs to be set the following:

`MAILCHIMP_API_KEY`

Optionally, you may set the REDIS url and port as follows


`REDIS_HOST` (default 127.0.0.1)

`REDIS_PORT` (default 6379)
