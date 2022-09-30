export class ClientError extends Error {
    constructor(message) {
        super(message);
        this.properties = {};
    }
    addPropertyError(property, error) {
        this.properties[property] = error;
    }
}
