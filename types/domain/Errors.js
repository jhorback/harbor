export class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
export class ServerError extends Error {
    constructor(message, innerError) {
        super(message);
        this.innerError = innerError;
    }
}
export class ClientError extends Error {
    constructor(message) {
        super(message);
        this.properties = {};
    }
    addPropertyError(property, error) {
        this.properties[property] = error;
    }
}
