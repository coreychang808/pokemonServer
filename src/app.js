// What goes in here?
const express = require('express');

// Middlewares?
// app level middleware libraries
const morgan = require('morgan');
const cors = require('cors');

// custom middleware?
const errorHandler = require('./middleware/server-error.js');
const notFound = require('./middleware/not-found.js');

// Routes?
const authRouter = require('./route/auth.js');
// Models?
// const authRouter;

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use(authRouter);
app.use('*', notFound);
app.use(errorHandler);

module.exports = {
  server: app,
  start: port => {
    let PORT = port || process.env.PORT || 8080;
    app.listen(PORT, () => console.log(`Listening on ${PORT}`));
  },
}