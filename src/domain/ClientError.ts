

interface IPropertyErrors {
    [key: string]: string
}

export class ClientError extends Error {

    constructor(message:string) {
        super(message);
    }

    addPropertyError(property:string, error:string) {
        this.properties[property] = error; 
    }

    properties:IPropertyErrors = {}
}