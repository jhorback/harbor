var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../../styles";
import { PageListContentController } from "./PageListContentController";
/**
 */
let PageListContent = class PageListContent extends LitElement {
    constructor() {
        super(...arguments);
        this.pathname = "";
        this.contentIndex = -1;
        this.pageListContent = new PageListContentController(this);
    }
    get stateId() { return this.pathname; }
    render() {
        const state = this.pageListContent.content;
        return html `
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${false}>                
                <div>
                    PRIMARY CONTENT
                </div>
                <div slot="edit-toolbar">
                    
                </div>
                <div slot="page-edit-empty" @click=${this.clickedEmpty}>
                    EDIT EMPTY CONTENT
                </div>
                <div slot="content-edit">
                    EDIT CONTENT
                </div>
                <div slot="content-edit-tools">
                    EDIT TOOLS
                </div>
            </hb-page-content>
        `;
    }
    clickedEmpty() {
        this.$hbPageContent.edit();
    }
};
PageListContent.styles = [styles.icons, styles.form, css `
        :host {
            display: block;
            position: relative;
        }
       
        div[slot="content-edit-tools"] {
            padding: 8px;
            display: flex;
            gap: 36px;
        }
        div[slot="content-edit-tools"] > div {
            flex-grow: 1;
        }
        div[slot="content-edit-tools"] > :first-child {
            text-align: right;
        }
        label {
            margin-right: 8px;
        }
  `];
__decorate([
    property({ type: String })
], PageListContent.prototype, "pathname", void 0);
__decorate([
    property({ type: Number, attribute: "content-index" })
], PageListContent.prototype, "contentIndex", void 0);
__decorate([
    query("hb-page-content")
], PageListContent.prototype, "$hbPageContent", void 0);
PageListContent = __decorate([
    customElement('hb-page-list-content')
], PageListContent);
export { PageListContent };
