import { IContentTypeDescriptor } from "../interfaces/PageInterfaces";



export const contentTypes = {
    register: (key:string, type:IContentTypeDescriptor) => registeredContentTypes[key] = type,
    get: (type:string) => {
        const dt = registeredContentTypes[type];
        if (dt === null) {
            throw new Error("content type not found");
        }
        return dt;
    },
    all: () => {
        return Object.keys(registeredContentTypes).map(type => registeredContentTypes[type])
    },
    newUId: () => {
        return crypto.randomUUID();
    }
};


const registeredContentTypes:{[type:string]: IContentTypeDescriptor}  = {};
