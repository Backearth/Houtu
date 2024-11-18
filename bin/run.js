const app = require('../app');
const debug = require('debug')('web-express:server');
const http = require('https');
const web_tool_config = require('../web_tool_config');
const fs =require('fs');

const port = normalizePort(process.env.PORT || web_tool_config.https_port);
app.set('port', port);

const https_options = {
    key: fs.readFileSync(web_tool_config.https_options.key),
    cert: fs.readFileSync(web_tool_config.https_options.cert)
};
const server = http.createServer(https_options, app);

server.listen(port, '0.0.0.0');
server.on('error', onError)
server.on('listening', onListening);

function normalizePort(val) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return 0;
}

function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening() {
    const addr = server.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    debug('Listening on ' + bind);
}