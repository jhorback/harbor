


export class NotFoundError extends Error {
    constructor(message:string) {
        super(message);
    }
}


export class ServerError extends Error {
    innerError?:Error;
    constructor(message:string, innerError?:Error) {
        super(message);
        this.innerError = innerError;
    }
}



interface IPropertyErrors { [key: string]: string }

export class ClientError extends Error {

    static of(message:string, properties:IPropertyErrors):ClientError {
        const error = new ClientError(message);
        error.properties = properties;
        return error;
    }

    constructor(message:string) {
        super(message);
    }

    addPropertyError(property:string, error:string) {
        this.properties[property] = error; 
    }

    properties:IPropertyErrors = {}
}