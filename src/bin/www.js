#!/usr/bin/env node
/**
 * Module dependencies.
 */
import debug from 'debug';
import http from 'http';
import app from '../app';
/**
 *
 * @param {val} val - val
 *
 * @return {number} - number
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (Number.isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

/**
 * Get port from environment and store in Express.
 */
const port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP server.
 */
const server = http.createServer(app);

// next code block goes here

/**
 *
 * @param {object} error - error
 *
 * @return {error} - handle specific listen errors with messages
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`;
  switch (error.code) {
    case 'EACCES': console.log(`${bind} requires elevated privileges`);
      process.exit(1);

      break;
    case 'EADDRINUSE': console.log(`${bind} is already in use`);
      process.exit(1);
      break; default: throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 *
 * @return {object} -
 */
const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
  debug(`Listening on ${bind}`);
};
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);
