export var ContentTypes;
(function (ContentTypes) {
    ContentTypes["text"] = "text";
    ContentTypes["image"] = "image";
})(ContentTypes || (ContentTypes = {}));
;
export const contentTypes = {
    register: (key, type) => registeredContentTypes[key] = type,
    get: (type) => {
        const dt = registeredContentTypes[type];
        if (dt === null) {
            throw new Error("content type not found");
        }
        return dt;
    },
    all: () => {
        return Object.keys(registeredContentTypes).map(type => registeredContentTypes[type]);
    }
};
const registeredContentTypes = {};
