
// handle input errors

const ClientError = require ('./ClientError');

class InputError extends ClientError {
    constructor(message) {
        super(message, 400);
    }
}

module.exports = InputError;