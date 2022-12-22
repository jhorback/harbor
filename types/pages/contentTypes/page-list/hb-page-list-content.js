var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { customElement, property, query } from "lit/decorators.js";
import "../../../common/hb-button";
import "../../../common/hb-card";
import { styles } from "../../../styles";
import { DEFAULT_IMAGE_URL } from "../image/imageContentType";
import { DragOrderController } from "../../../common/DragOrderController";
import { AddListPageEvent, ChangePageListDisplayEvent, PageListContentController, RemovePageListItemEvent } from "./PageListContentController";
import { PageListDisplay } from "./pageListContentType";
/**
 */
let PageListContent = class PageListContent extends LitElement {
    constructor() {
        super(...arguments);
        this.pathname = "";
        this.contentIndex = -1;
        this.pageListContent = new PageListContentController(this);
        this.dragOrderController = new DragOrderController(this);
    }
    get stateId() { return this.pathname; }
    render() {
        const state = this.pageListContent.content;
        const contentState = this.pageListContent.contentState;
        return html `
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${!state.pages || state.pages.length === 0}>                
                <div>
                    ${state.pages.length === 0 ? html `` : this.renderPages("")}
                </div>
                <div slot="edit-toolbar">
                    <!-- NO TOOLBAR //-->
                </div>
                <div slot="page-edit-empty" @click=${this.clickedEmpty}>
                    ${this.renderDefault()}
                </div>
                <div slot="content-edit">
                    ${state.pages.length === 0 ? this.renderDefault() : this.renderPages("editable")}
                    <hb-find-page-dialog
                        @page-selected=${this.pageSelected}
                    ></hb-find-page-dialog>
                    <hb-add-page-dialog
                        url-prefix=${location.pathname === "/" ? "" : location.pathname}
                        @page-added=${this.pageAdded}
                    ></hb-add-page-dialog>
                </div>
                <div slot="content-edit-tools">
                    <div>
                        <label for="size">Display type</label>
                        <select id="size" .value=${state.display} @change=${this.displayTypeChanged}>
                            <option value=${PageListDisplay.verticalCard}>Card</option>
                            <option value=${PageListDisplay.horizontalCard}>Horizontal Card</option>
                            <option value=${PageListDisplay.textOnly}>Text Only</option>
                        </select>
                    </div>
                    <hb-button
                        label="Add New Page"
                        text-button
                        @click=${this.addNewPage}
                    ></hb-button>
                    <hb-button
                        label="Search for Page"
                        text-button
                        @click=${this.searchForPage}
                    ></hb-button>
                </div>
            </hb-page-content>
        `;
    }
    updated() {
        this.pageListContent.contentState.inContentEditMode ?
            this.dragOrderController.attach(this.$editablePageList) :
            this.dragOrderController.detach();
    }
    renderDefault() {
        return html `
            <hb-card
                media-url=${DEFAULT_IMAGE_URL}
                text="Add Page"
                description="Add a new page or search for an existing page to add"
            ></hb-card>
        `;
    }
    renderPages(className) {
        const state = this.pageListContent.content;
        const size = this.pageListContent.page.state.page.pageSize;
        return html `
            <div class=${["page-list", className].join(" ")}
                page-size=${size}>
                ${state.pages.map((page, index) => state.display === PageListDisplay.horizontalCard ?
            this.renderHorizontalCard(page, index) : state.display === PageListDisplay.verticalCard ?
            this.renderVerticalCard(page, index) :
            this.renderTextOnly(page, index))}
            </div>
        `;
    }
    renderVerticalCard(page, index) {
        const inContentEditMode = this.pageListContent.contentState.inContentEditMode;
        return html `
            <hb-card
                visibility=${this.pageListContent.getPageVisibility(page.isVisible)}
                media-url=${ifDefined(page.thumbUrl === null ? undefined : page.thumbUrl)}
                media-href=${inContentEditMode ? "javascript:;" : page.href}
                text=${page.title}
                description=${ifDefined(page.thumbDescription === null ? undefined : page.thumbDescription)}>
                    ${renderDeleteIcon(inContentEditMode, index)}
            </hb-card>
        `;
    }
    renderHorizontalCard(page, index) {
        const inContentEditMode = this.pageListContent.contentState.inContentEditMode;
        return html `
            <hb-horizontal-card
                visibility=${this.pageListContent.getPageVisibility(page.isVisible)}
                media-url=${ifDefined(page.thumbUrl === null ? undefined : page.thumbUrl)}
                media-href=${inContentEditMode ? "javascript:;" : page.href}
                text=${page.title}
                description=${ifDefined(page.thumbDescription === null ? undefined : page.thumbDescription)}>
                    ${renderDeleteIcon(inContentEditMode, index)}      
            </hb-horizontal-card>
        `;
    }
    renderTextOnly(page, index) {
        const inContentEditMode = this.pageListContent.contentState.inContentEditMode;
        return html `
            <hb-card
                visibility=${this.pageListContent.getPageVisibility(page.isVisible)}
                media-href=${inContentEditMode ? "javascript:;" : page.href}
                text=${page.title}
                description=${ifDefined(page.thumbDescription === null ? undefined : page.thumbDescription)}>
                ${renderDeleteIcon(inContentEditMode, index)}
            </hb-card>
        `;
    }
    clickedEmpty() {
        this.$hbPageContent.edit();
    }
    addNewPage() {
        this.$addPageDialog.showModal();
    }
    searchForPage() {
        this.$findPageDialog.showModal();
    }
    pageSelected(event) {
        this.dispatchEvent(new AddListPageEvent(event.pageModel.toPageThumbnail()));
    }
    pageAdded(event) {
        this.dispatchEvent(new AddListPageEvent(event.pageModel.toPageThumbnail()));
    }
    displayTypeChanged(event) {
        const display = event.target.value;
        this.dispatchEvent(new ChangePageListDisplayEvent(display));
    }
    static { this.styles = [styles.icons, styles.form, css `
        :host {
            display: block;
            position: relative;
        }       
        div[slot="content-edit-tools"] {
            padding: 8px;
            display: flex;
            gap: 8px;
            text-align: right;
        }
        div[slot="content-edit-tools"] > :first-child {
            flex-grow: 1;
            text-align: left;
        }
        div[slot="content-edit-tools"] hb-button {
            margin-top: 5px;
        }
        .page-list {
            display: grid;
            gap: 10px;
            grid-template-columns: repeat(3, 1fr);
        }
        .page-list[page-size=small] {
            grid-template-columns: repeat(2, 1fr);
        }
        .page-list[page-size=large] {
            grid-template-columns: repeat(4, 1fr);
        }
        .page-list[page-size=wide],
        .page-list[page-size=full] {
            grid-template-columns: repeat(4, 1fr);
        }
        .page-list > * {
            position: relative;
        }
        label {
            margin-right: 8px;
        }
        .page-list > *:hover .delete-icon {
            display: inline-block;
        }
        .delete-icon {
            display: none;
            position: absolute;
            top: 4px;
            left: 4px;
            background-color: var(--md-sys-color-background);
        }
        [visibility=hidden] {
            display: none;
        }
        [visibility=author] {
            opacity: 0.7;

        }
        [visibility=author]::after {
            content:"hidden";
            position: absolute;
            bottom: -2px;
            right: 0;
            padding: 4px 8px;
            background-color: var(--md-sys-color-background);
            color: var(--md-sys-color-on-background);
            border-radius: 8px 0 8px 0;
        }
  `]; }
};
__decorate([
    property({ type: String })
], PageListContent.prototype, "pathname", void 0);
__decorate([
    property({ type: Number, attribute: "content-index" })
], PageListContent.prototype, "contentIndex", void 0);
__decorate([
    query(".page-list.editable")
], PageListContent.prototype, "$editablePageList", void 0);
__decorate([
    query("hb-page-content")
], PageListContent.prototype, "$hbPageContent", void 0);
__decorate([
    query("hb-find-page-dialog")
], PageListContent.prototype, "$findPageDialog", void 0);
__decorate([
    query("hb-add-page-dialog")
], PageListContent.prototype, "$addPageDialog", void 0);
PageListContent = __decorate([
    customElement('hb-page-list-content')
], PageListContent);
export { PageListContent };
const renderDeleteIcon = (inEditMode, index) => inEditMode ? html `
    <div class="delete-icon icon-button" title="Remove" @click=${(e) => removePage(e, index)}>close</div>
` : html ``;
const removePage = (event, index) => {
    const target = event.target;
    target?.dispatchEvent(new RemovePageListItemEvent(index));
};
