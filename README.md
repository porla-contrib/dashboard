# Dashboard for Porla

A simple dashboard for Porla, to allow easy monitoring and managing of
torrents.


## Installing

```js
const porla     = require('porla');
const dashboard = require('@porla-contrib/dashboard');

const app = porla({
    plugins: [ dashboard({ port: 7090 }) ]
});
```

### Options

The options object is passed to the Dashboard constructor and has the following
properties.

 * `port`, the HTTP port to serve the dashboard. If no port is specified,
   it defaults to *3000*.
