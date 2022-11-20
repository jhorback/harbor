var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../../styles";
import { AddListPageEvent, ChangePageListDisplayEvent, PageListContentController, ReorderPageListItemsEvent } from "./PageListContentController";
import "../../../common/hb-button";
import "../../../common/hb-card";
import { DEFAULT_IMAGE_URL } from "../image/imageContentType";
import { PageListDisplay } from "./pageListContentType";
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
        const contentState = this.pageListContent.contentState;
        return html `
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${state.pages.length === 0}>                
                <div>
                    ${state.pages.length === 0 ? html `` : this.renderPages(contentState)}
                </div>
                <div slot="edit-toolbar">
                    <!-- NO TOOLBAR //-->
                </div>
                <div slot="page-edit-empty" @click=${this.clickedEmpty}>
                    ${this.renderDefault()}
                </div>
                <div slot="content-edit">
                    ${state.pages.length === 0 ? this.renderDefault() : this.renderPages(contentState)}
                    <hb-find-page-dialog
                        @page-selected=${this.pageSelected}
                    ></hb-find-page-dialog>
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
    renderDefault() {
        return html `
            <hb-card
                media-url=${DEFAULT_IMAGE_URL}
                text="Add Page"
                description="Add a new page or search for an existing page to add"
            ></hb-card>
        `;
    }
    renderPages(contentState) {
        const state = this.pageListContent.content;
        return html `
            <div class="page-list"
                .index=${state.pages.length}
                @dragover=${pageListDragOver}
                @drop=${pageListDrop}>
                ${state.pages.map((page, index) => state.display === PageListDisplay.horizontalCard ?
            renderHorizontalCard(contentState, page) : state.display === PageListDisplay.verticalCard ?
            renderVerticalCard(contentState, page, index) :
            renderTextOnly(contentState, page))}
            </div>
        `;
    }
    clickedEmpty() {
        this.$hbPageContent.edit();
    }
    addNewPage() {
    }
    searchForPage() {
        this.$findPageDialog.showModal();
    }
    pageSelected(event) {
        this.dispatchEvent(new AddListPageEvent(event.pageModel.toPageThumbnail()));
    }
    displayTypeChanged(event) {
        const display = event.target.value;
        this.dispatchEvent(new ChangePageListDisplayEvent(display));
    }
};
PageListContent.styles = [styles.icons, styles.form, css `
        :host {
            display: block;
            position: relative;
            --hb-page-list-item-page-wide-width: 292px;
            --hb-page-list-item-page-medium-width: 243px;
            --hb-page-list-item-width: var(--hb-page-list-item-page-medium-width);
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
            grid-template-columns: repeat(auto-fill, var(--hb-page-list-item-width));
        }
        .page-list > * {
          
        }
        hb-card {
            max-width: var(--hb-page-list-item-width);
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
__decorate([
    query("hb-find-page-dialog")
], PageListContent.prototype, "$findPageDialog", void 0);
PageListContent = __decorate([
    customElement('hb-page-list-content')
], PageListContent);
export { PageListContent };
const renderVerticalCard = (contentState, page, index) => html `
    <hb-card
        .index=${index}
        draggable="true"
        @dragstart=${pageDragStart}
        @dragend=${pageDragEnd}
        @dragenter=${pageDragEnter}
        @dragleave=${pageDragLeave}
        media-url=${page.thumbUrl}
        media-href=${contentState.isActive ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}
    ></hb-card>
`;
// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#draggableattribute
const pageDragStart = (event) => {
    const dt = event.dataTransfer;
    const target = event.target;
    target.style.opacity = "0.4";
    dt.effectAllowed = "move";
    dt.setData("application/harbor-app-page", target.index);
};
const pageDragEnd = (event) => {
    const target = event.target;
    target.style.opacity = "1";
};
const pageDragEnter = (event) => {
    const target = event.target;
    target.style.opacity = "0.2";
};
const pageDragLeave = (event) => {
    const target = event.target;
    target.style.opacity = "1";
};
const pageListDragOver = (event) => {
    event.preventDefault();
    const dt = event.dataTransfer;
    dt.dropEffect = "move";
};
const pageListDrop = (event) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.target;
    target.style.opacity = "1";
    const dt = event.dataTransfer;
    const sourceIndex = parseInt(dt.getData("application/harbor-app-page"));
    const targetIndex = parseInt(target.index);
    target.dispatchEvent(new ReorderPageListItemsEvent(sourceIndex, targetIndex));
};
const renderHorizontalCard = (contentState, page) => html `
    <hb-horizontal-card
        media-url=${page.thumbUrl}
        media-href=${contentState.isActive ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}
    ></hb-horizontal-card>
`;
const renderTextOnly = (contentState, page) => html `
    <hb-card
        media-href=${contentState.isActive ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}
    ></hb-card>
`;
