var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ImageContentData_1;
import { DataElement } from "@domx/dataelement";
import { customDataElement, dataProperty } from "@domx/dataelement/decorators";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey } from "../../../domain/interfaces/FileInterfaces";
import { ImageContentDataState } from "../imageContentType";
let ImageContentData = ImageContentData_1 = class ImageContentData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = ImageContentData_1.defaultState;
    }
    get uid() { return this.getAttribute("uid") || ""; }
    set uid(uid) { this.setAttribute("uid", uid); }
    connectedCallback() {
        super.connectedCallback();
    }
};
ImageContentData.defaultState = new ImageContentDataState();
__decorate([
    dataProperty()
], ImageContentData.prototype, "state", void 0);
__decorate([
    inject(FindFileRepoKey)
], ImageContentData.prototype, "findFileRepo", void 0);
ImageContentData = ImageContentData_1 = __decorate([
    customDataElement("hb-image-content-data", {
        eventsListenAt: "self",
        stateIdProperty: "uid"
    })
], ImageContentData);
export { ImageContentData };
