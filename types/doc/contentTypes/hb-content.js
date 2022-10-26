var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContentActiveChangeEvent, DocEditModeChangeEvent } from "../docTypes/pages/hb-doc-page";
import { styles } from "../../styles";
import { MoveDocContentEvent } from "../data/hb-doc-data";
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
        this.$docHostRef = null;
    }
    get $docHost() { return this.$contentHost.getRootNode().host; }
    get $contentHost() { return this.getRootNode().host; }
    connectedCallback() {
        super.connectedCallback();
        this.editModeHandler = this.editModeChange.bind(this);
        this.$docHostRef = this.$docHost;
        this.$docHostRef.addEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
        this.docEdit = this.$docHost.inEditMode;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.editModeHandler && this.$docHostRef &&
            this.$docHostRef.removeEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
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
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Done editing"
                                @click=${this.done}>
                                check
                            </span>
                        ` : html `
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Move down"
                                @click=${this.moveDownClicked}>
                                arrow_downward
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Move up"
                                @click=${this.moveUpClicked}>
                                arrow_upward
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Edit"
                                @click=${this.edit}>
                                edit
                            </span>
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
    moveUpClicked() {
        const index = this.$contentHost.contentIndex;
        index !== undefined ? this.dispatchEvent(new MoveDocContentEvent(index, true)) :
            console.error("Cannot move up, content has no content index");
    }
    moveDownClicked() {
        const index = this.$contentHost.contentIndex;
        index !== undefined ? this.dispatchEvent(new MoveDocContentEvent(index, false)) :
            console.error("Cannot move down, content has no content index");
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
HbContent.styles = [styles.icons, css `
        :host {
            display: block;
            position: relative;       
        }
        .edit-toolbar {
            display: none;
            gap: 10px;
            position: absolute;
            top:0;
            right: 0;
            z-index: 10000;
            // background-color: var(--md-sys-color-surface-variant);
            // border-radius: var(--md-sys-shape-corner-medium);
            padding: 4px;
        }
        :host([doc-edit]:hover),
        :host([doc-edit][is-active]),
        :host([content-edit]) {            
            //background-color: var(--md-sys-color-surface-variant);
            border-radius: var(--md-sys-shape-corner-medium);
            outline: 1px solid var(--md-sys-color-outline);
            margin: -1rem;
            padding: 1rem;
        }
        // :host([content-edit]) {
        //     outline: 0px solid transparent !important;
        // }
        :host([doc-edit]:hover) .edit-toolbar,
        :host([doc-edit][is-active]) .edit-toolbar,
        :host([content-edit]) .edit-toolbar {
            display: flex;
            justify-content: end;
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
