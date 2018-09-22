# Dashboard for Porla

A dashboard for Porla to allow for easy monitoring of Porla.


## Installing

```js
const { Porla } = require('@porla/porla');
const Dashboard = require('@porla-contrib/dashboard');

const app = new Porla({
    plugins: [ new Dashboard({ httpPort: 7000 }) ]
});
```

### Options

The options object is passed to the Dashboard constructor and has the following
properties.

 * `httpPort`, the HTTP port to serve the dashboard. If no port is specified,
   it defaults to *3000*.
