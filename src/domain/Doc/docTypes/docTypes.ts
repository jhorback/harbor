import { IDocTypeDescriptor } from "../../interfaces/DocumentInterfaces";


export enum DocTypes {
    doc = "doc"
}



export const docTypes = {
    register: (key:string, type:IDocTypeDescriptor) => registeredDocTypes[key] = type,
    get: (type:string) => {
        const dt = registeredDocTypes[type];
        if (dt === null) {
            throw new Error("doc type not found");
        }
        return dt;
    },
    all: () => {
        return Object.keys(registeredDocTypes).map(type => registeredDocTypes[type])
    }
};


const registeredDocTypes:{[type:string]: IDocTypeDescriptor}  = {};
