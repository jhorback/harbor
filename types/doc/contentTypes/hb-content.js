var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContentActiveChangeEvent, DocEditModeChangeEvent } from "../docTypes/pages/hb-doc-page";
/**
 */
let HbContent = class HbContent extends LitElement {
    constructor() {
        super(...arguments);
        this.isEmpty = false;
        this.docEdit = false;
        this.contentEdit = false;
        this.isActive = false;
        this.editModeHandler = null;
    }
    get $host() { return this.getRootNode().host.getRootNode().host; }
    ;
    connectedCallback() {
        super.connectedCallback();
        this.editModeHandler = this.editModeChange.bind(this);
        this.$host.addEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.editModeHandler &&
            this.$host.removeEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
    }
    editModeChange(event) {
        this.docEdit = event.inEditMode;
    }
    render() {
        return html `
            <div class="hb-content" @click=${this.contentClicked}>
                ${this.docEdit ? html `
                    <div class="edit-toolbar">
                        ${this.contentEdit ? html `
                            <slot name="edit-toolbar"></slot>
                            <button @click=${this.done}>Done</button>
                        ` : html `
                            <button>Move Down</button>
                            <button>Move Up</button>
                            <button @click=${this.edit}>Edit</button>
                        `}                    
                    </div>                
                ` : html ``}
                ${!this.contentEdit && this.docEdit && this.isEmpty ? html `
                    <slot name="doc-edit-empty"></slot>
                ` : this.contentEdit ? html `
                    <slot name="content-edit"></slot>
                ` : html `
                    <slot></slot>
                `}
            </div>
        `;
    }
    contentClicked(event) {
        if (this.docEdit && !this.isActive) {
            this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        }
    }
    edit() {
        this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        this.contentEdit = true;
    }
    done(event) {
        this.dispatchEvent(new ContentActiveChangeEvent(this, false));
        event.stopImmediatePropagation();
    }
};
HbContent.styles = [css `
        :host {
            display: block;                      
        }
        .edit-toolbar {
            display: none;
        }
        :host([doc-edit]:hover),
        :host([doc-edit][is-active]),
        :host([content-edit]) {
            border: 1px dotted red;
        }
        :host([doc-edit]:hover) .edit-toolbar,
        :host([doc-edit][is-active]) .edit-toolbar,
        :host([content-edit]) .edit-toolbar {
            display: flex;
        }        
  `];
__decorate([
    property({ type: Boolean, attribute: "is-empty" })
], HbContent.prototype, "isEmpty", void 0);
__decorate([
    property({ type: Boolean, attribute: "doc-edit", reflect: true })
], HbContent.prototype, "docEdit", void 0);
__decorate([
    property({ type: Boolean, attribute: "content-edit", reflect: true })
], HbContent.prototype, "contentEdit", void 0);
__decorate([
    property({ type: Boolean, attribute: "is-active", reflect: true })
], HbContent.prototype, "isActive", void 0);
HbContent = __decorate([
    customElement('hb-content')
], HbContent);
export { HbContent };
