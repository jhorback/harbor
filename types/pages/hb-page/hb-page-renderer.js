var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { PagePathnameChangeEvent, RequestPageEvent } from "./PageController";
let HbPageRenderer = class HbPageRenderer extends LitElement {
    render() {
        return html `
            <hb-page pathname=${location.pathname.toLowerCase()}></hb-page>
        `;
    }
    async updated() {
        window.dispatchEvent(new PagePathnameChangeEvent(this.pathname));
        this.$hbPage.dispatchEvent(new RequestPageEvent());
    }
};
__decorate([
    property({ type: String })
], HbPageRenderer.prototype, "pathname", void 0);
__decorate([
    query("hb-page")
], HbPageRenderer.prototype, "$hbPage", void 0);
HbPageRenderer = __decorate([
    customElement("hb-page-renderer")
], HbPageRenderer);
export { HbPageRenderer };
