var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../../common/hb-button";
import { PageTabsContentController } from "./PageTabsContentController";
/**
 */
let PageTabsContent = class PageTabsContent extends LitElement {
    constructor() {
        super(...arguments);
        this.pathname = "";
        this.contentIndex = -1;
        this.pageTabsContent = new PageTabsContentController(this);
    }
    get stateId() { return this.pathname; }
    render() {
        const state = this.pageTabsContent.content;
        const contentState = this.pageTabsContent.contentState;
        return html `
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${!state.tabs || state.tabs.length === 0}>                
                
                <div slot="edit-toolbar">
                    <!-- NO TOOLBAR //-->
                </div>
                <div slot="page-edit-empty">
                    
                </div>
                <div slot="content-edit">
                   
                </div>
                <div slot="content-edit-tools">
                    
                </div>
            </hb-page-content>
        `;
    }
};
PageTabsContent.styles = [css `
        :host {
            display: block;           
        }       
       
  `];
__decorate([
    property({ type: String })
], PageTabsContent.prototype, "pathname", void 0);
__decorate([
    property({ type: Number, attribute: "content-index" })
], PageTabsContent.prototype, "contentIndex", void 0);
__decorate([
    query("hb-page-content")
], PageTabsContent.prototype, "$hbPageContent", void 0);
PageTabsContent = __decorate([
    customElement('hb-page-tabs-content')
], PageTabsContent);
export { PageTabsContent };
