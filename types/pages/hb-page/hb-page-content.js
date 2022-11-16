var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import { ContentActiveChangeEvent } from "./PageController";
import { MovePageContentEvent } from "./PageController";
import { PageContentController } from "./PageContentController";
/**
 */
let HbPageContent = class HbPageContent extends LitElement {
    constructor() {
        super(...arguments);
        this.pageContent = new PageContentController(this);
        this.pathname = "";
        this.contentIndex = -1;
        this.isEmpty = false;
    }
    get stateId() { return this.pathname; }
    // @property({type: Boolean, attribute: "page-edit", reflect: true})
    // pageEdit = false;
    // @property({type: Boolean, attribute: "content-edit", reflect: true})
    // contentEdit = false;
    // @property({type: Boolean, attribute: "is-active", reflect: true})
    // isActive = false;
    render() {
        const pageState = this.pageContent.page.state;
        const contentState = this.pageContent.state;
        return html `
            <div class="hb-content"
                ?page-edit=${pageState.inEditMode}
                ?content-edit=${contentState.inContentEditMode}
                ?is-active=${contentState.isActive}
                @click=${this.contentClicked}>
                ${pageState.inEditMode ? html `
                    <div class="edit-toolbar">
                        ${contentState.inContentEditMode ? html `
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
                                ?disabled=${!contentState.canMoveDown}
                                @click=${this.moveDownClicked}>
                                arrow_downward
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Move up"
                                ?disabled=${!contentState.canMoveUp}
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
                ${!contentState.inContentEditMode && pageState.inEditMode && this.isEmpty ? html `
                    <slot name="page-edit-empty"></slot>
                ` : contentState.inContentEditMode ? html `
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
    contentClicked(event) {
        if (this.pageContent.page.pageEdit && !this.pageContent.state.isActive) {
            this.dispatchEvent(new ContentActiveChangeEvent({
                contentIndex: this.contentIndex,
                isActive: true,
                inEditMode: false
            }));
        }
    }
    moveUpClicked() {
        const contentState = this.pageContent.state;
        contentState.canMoveUp &&
            this.dispatchEvent(new MovePageContentEvent(this.contentIndex, true));
    }
    moveDownClicked() {
        const contentState = this.pageContent.state;
        contentState.canMoveDown &&
            this.dispatchEvent(new MovePageContentEvent(this.contentIndex, false));
    }
    edit() {
        this.dispatchEvent(new ContentActiveChangeEvent({
            contentIndex: this.contentIndex,
            isActive: true,
            inEditMode: true
        }));
    }
    delete() {
        if (!confirm("Are you sure you want to delete this content?")) {
            return;
        }
        alert("delete");
    }
    done(event) {
        this.dispatchEvent(new ContentActiveChangeEvent({
            contentIndex: this.contentIndex,
            inEditMode: false,
            isActive: false
        }));
    }
};
HbPageContent.styles = [styles.icons, css `
        :host {
            display: block;       
        }
        .hb-content {
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
        .hb-content[page-edit]:hover,
        .hb-content[page-edit][is-active],
        .hb-content[content-edit] {
            border-radius: var(--md-sys-shape-corner-medium);
            outline: 1px solid var(--md-sys-color-outline);
            margin: -1rem;
            padding: 1rem;
        }
        .hb-content[page-edit]:hover .edit-toolbar,
        .hb-content[page-edit][is-active] .edit-toolbar,
        .hb-content[content-edit] .edit-toolbar {
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
        span[disabled] {
            opacity: 0.12;
        }
  `];
__decorate([
    property({ type: String })
], HbPageContent.prototype, "pathname", void 0);
__decorate([
    property({ type: Number, attribute: "content-index" })
], HbPageContent.prototype, "contentIndex", void 0);
__decorate([
    property({ type: Boolean, attribute: "is-empty" })
], HbPageContent.prototype, "isEmpty", void 0);
HbPageContent = __decorate([
    customElement('hb-page-content')
], HbPageContent);
export { HbPageContent };
