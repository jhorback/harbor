import { IPageTemplateDescriptor } from "../interfaces/PageInterfaces";


export enum PageTemplates {
    page = "page"
}



export const pageTemplates = {
    register: (key:string, template:IPageTemplateDescriptor) => registeredTemplates[key] = template,
    get: (type:string) => {
        const template = registeredTemplates[type];
        if (template === null) {
            throw new Error("Page template not found");
        }
        return template;
    },
    all: () => {
        return Object.keys(registeredTemplates).map(type => registeredTemplates[type])
    }
};


const registeredTemplates:{[type:string]: IPageTemplateDescriptor}  = {};
