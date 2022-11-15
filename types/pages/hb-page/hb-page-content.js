var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import { ContentActiveChangeEvent, ContentEmptyEvent, PageEditModeChangeEvent } from "./hb-page";
import { MovePageContentEvent } from "./PageController";
/**
 */
let HbPageContent = class HbPageContent extends LitElement {
    constructor() {
        super(...arguments);
        this.isEmpty = false;
        this.pageEdit = false;
        this.contentEdit = false;
        this.isActive = false;
        this.abortController = new AbortController();
    }
    get $pageHost() { return this.$contentHost.getRootNode().host; }
    get $contentHost() { return this.getRootNode().host; }
    connectedCallback() {
        super.connectedCallback();
        this.$pageHost.addEventListener(PageEditModeChangeEvent.eventType, this.editModeChange.bind(this), { signal: this.abortController.signal });
        this.pageEdit = this.$pageHost.inEditMode;
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.abortController.abort();
        this.abortController = new AbortController();
    }
    editModeChange(event) {
        this.pageEdit = event.inEditMode;
    }
    render() {
        return html `
            <div class="hb-content" @click=${this.contentClicked}>
                ${this.pageEdit ? html `
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
                                title="Delete content"
                                @click=${this.delete}>
                                delete
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Edit content"
                                @click=${this.edit}>
                                edit
                            </span>
                        `}                    
                    </div>                
                ` : html ``}
                ${!this.contentEdit && this.pageEdit && this.isEmpty ? html `
                    <slot name="page-edit-empty"></slot>
                ` : this.contentEdit ? html `
                    <slot name="content-edit"></slot>
                    <div class="content-edit-tools">
                        <slot name="content-edit-tools"></slot>
                    </div>
                ` : html `
                    <slot></slot>
                `}
            </div>
        `;
    }
    updated() {
        const index = this.$contentHost.contentIndex;
        this.dispatchEvent(new ContentEmptyEvent(this.$contentHost, this.isEmpty));
    }
    contentClicked(event) {
        if (this.pageEdit && !this.isActive) {
            this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        }
    }
    moveUpClicked() {
        const index = this.$contentHost.contentIndex;
        index !== undefined ? this.dispatchEvent(new MovePageContentEvent(index, true)) :
            console.error("Cannot move up, content has no content index");
    }
    moveDownClicked() {
        const index = this.$contentHost.contentIndex;
        index !== undefined ? this.dispatchEvent(new MovePageContentEvent(index, false)) :
            console.error("Cannot move down, content has no content index");
    }
    edit() {
        this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        this.contentEdit = true;
    }
    delete() {
        if (!confirm("Are you sure you want to delete this content?")) {
            return;
        }
        alert("delete");
    }
    done(event) {
        this.dispatchEvent(new ContentActiveChangeEvent(this, false));
        event.stopImmediatePropagation();
    }
};
HbPageContent.styles = [styles.icons, css `
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
            z-index: 19;
            padding: 4px;
            border: 1px solid var(--md-sys-color-outline);
            border-radius: 0 12px;
            border-width: 0 0 1px 1px;
            background-color: var(--md-sys-color-surface-variant)
        }
        :host([page-edit]:hover),
        :host([page-edit][is-active]),
        :host([content-edit]) {
            border-radius: var(--md-sys-shape-corner-medium);
            outline: 1px solid var(--md-sys-color-outline);
            margin: -1rem;
            padding: 1rem;
        }
        :host([page-edit]:hover) .edit-toolbar,
        :host([page-edit][is-active]) .edit-toolbar,
        :host([content-edit]) .edit-toolbar {
            display: flex;
            justify-content: end;
        }
        .content-edit-tools {
            background: var(--md-sys-color-surface-variant);
            border-radius: 0 0 12px 12px;
            // outline: 1px solid var(--md-sys-color-outline);        
            margin: -1rem;
            margin-top: 8px;
        }
  `];
__decorate([
    property({ type: Boolean, attribute: "is-empty" })
], HbPageContent.prototype, "isEmpty", void 0);
__decorate([
    property({ type: Boolean, attribute: "page-edit", reflect: true })
], HbPageContent.prototype, "pageEdit", void 0);
__decorate([
    property({ type: Boolean, attribute: "content-edit", reflect: true })
], HbPageContent.prototype, "contentEdit", void 0);
__decorate([
    property({ type: Boolean, attribute: "is-active", reflect: true })
], HbPageContent.prototype, "isActive", void 0);
HbPageContent = __decorate([
    customElement('hb-page-content')
], HbPageContent);
export { HbPageContent };
