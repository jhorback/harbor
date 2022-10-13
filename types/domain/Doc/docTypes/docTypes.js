export var DocTypes;
(function (DocTypes) {
    DocTypes["doc"] = "doc";
})(DocTypes || (DocTypes = {}));
export const docTypes = {
    register: (key, type) => registeredDocTypes[key] = type,
    get: (type) => {
        const dt = registeredDocTypes[type];
        if (dt === null) {
            throw new Error("doc type not found");
        }
        return dt;
    },
    all: () => {
        return Object.keys(registeredDocTypes).map(type => registeredDocTypes[type]);
    }
};
const registeredDocTypes = {};
