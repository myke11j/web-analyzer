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
For eg, try sending anything other than `pageURL` query in /fetch-html service.

## Assumptions/Tech Stack

- One assumption was that user can enter invalid URLs, so instead of sending every request to server, I have handled it on front-end itself.
- To make sure service can only be requested with a specific set number of params or payload or queries, I've build a middleware (read more in middleware section).
- For back-end I've used `nodejs` and for front-end `reactjs`. For building, I'm using `webpack` config.
