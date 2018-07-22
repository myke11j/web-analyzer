# Scout24 Coding Challange

Scout 24 Coding challange for analysing web pages.

# Setup

Modified following MERN Boilerplate: https://github.com/keithweaver/MERN-boilerplate

```
npm install
```

For running in dev mode: 

```
npm run start:dev
```

For running in prod mode: 

```
npm start
```

## Lint

```
npm run lint
npm run lintfix
```

## Middlewares

I've used custom middleware to check payload and queries coming from front-end to make sure server only accepts which we specified for the API. 
For eg, try sending anything other than `pageURL` query in `/fetch-html` service.

## Steps/Tech Stack

- When picking stack for this app, I chose MERN as React is quite good to develop apps fast. I've used a [boilerplate](https://github.com/keithweaver/MERN-boilerplate) for setting up the baic skeleton of app but modified it a lot.
- One assumption during building the app was that user can enter invalid URLs, so instead of sending every request to server, I have handled it on front-end itself.
- To make sure service can only be requested with a specific set number of params or payload or queries, I've build a middleware (read more in middleware section).
- In case of serer down, `unable to fetch` message will be showed to user on submit.
- I've abstracted all the logic in helper and services frm controller.
- I've not much focused on UI, so you'll find a very basic but functional look of page powered by bootstrap.
- I've created a specific service to send response to client, so that logic of statusCode and format can abstracted from controllers. Service can be found [here](https://github.com/myke11j/web-analyzer/blob/master/server/services/api-response.js)

## Use Cases

- If URL is inaccurate, alert user about the format. Eg URL: `htt://www.google.com`
- If server is down, alert user about it.
- Only pages hosted over https can be analyzed, if user request a http page, alert user about it. Eg URL: `http://harrypotter.wikia.com/wiki/Hufflepuff`
- If page requested by user doesn't exist, show the user necessary information. Eg URL: `https://www.npmjs.com/package/aleddd`