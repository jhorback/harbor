export var PageTemplates;
(function (PageTemplates) {
    PageTemplates["page"] = "page";
})(PageTemplates || (PageTemplates = {}));
export const pageTemplates = {
    register: (key, template) => registeredTemplates[key] = template,
    get: (type) => {
        const template = registeredTemplates[type];
        if (template === null) {
            throw new Error("Page template not found");
        }
        return template;
    },
    all: () => {
        return Object.keys(registeredTemplates).map(type => registeredTemplates[type]);
    }
};
const registeredTemplates = {};
