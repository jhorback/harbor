import { css, html, LitElement, ReactiveController } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../../common/hb-button";
import "../../../common/hb-card";
import { IPageThumbnail } from "../../../domain/interfaces/PageInterfaces";
import { styles } from "../../../styles";
import { FindPageDialog, PageSelectedEvent } from "../../hb-find-page-dialog";
import { HbPageContent } from "../../hb-page";
import { IPageContentState } from "../../hb-page/PageContentController";
import { DEFAULT_IMAGE_URL } from "../image/imageContentType";
import { AddListPageEvent, ChangePageListDisplayEvent, PageListContentController, RemovePageListItemEvent, ReorderPageListItemsEvent } from "./PageListContentController";
import { PageListDisplay } from "./pageListContentType";

/**
 */
@customElement('hb-page-list-content')
export class PageListContent extends LitElement {

    get stateId() { return this.pathname; }

    @property({type:String})
    pathname:string = "";

    @property({type:Number, attribute: "content-index"})
    contentIndex:number = -1;

    pageListContent:PageListContentController = new PageListContentController(this);

    @query("hb-page-content")
    $hbPageContent!:HbPageContent;

    @query("hb-find-page-dialog")
    $findPageDialog!:FindPageDialog;


    render() {
        const state = this.pageListContent.content;
        const contentState = this.pageListContent.contentState;
        return html`
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${state.pages.length === 0}>                
                <div>
                    ${state.pages.length === 0 ? html`` : this.renderPages(contentState)}
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

    private renderDefault() {
        return html`
            <hb-card
                media-url=${DEFAULT_IMAGE_URL}
                text="Add Page"
                description="Add a new page or search for an existing page to add"
            ></hb-card>
        `;
    }

    private renderPages(contentState:IPageContentState) {
        const state = this.pageListContent.content;
        const inEditMode = this.pageListContent.contentState.inContentEditMode;
        return html`
            <div class="page-list"
                .index=${state.pages.length}
                @dragover=${inEditMode ? pageListDragOver : noop}
                @drop=${inEditMode ? pageListDrop : noop}>
                ${state.pages.map((page, index) => state.display === PageListDisplay.horizontalCard ?
                    renderHorizontalCard(contentState, page, index) : state.display === PageListDisplay.verticalCard ?
                        renderVerticalCard(contentState, page, index) :
                        renderTextOnly(contentState, page, index)
                )}
            </div>
        `;
    }

    private clickedEmpty() {
        this.$hbPageContent.edit();
    }

    private addNewPage() {

    }

    private searchForPage() {
       this.$findPageDialog.showModal();
    }

    private pageSelected(event:PageSelectedEvent) {
        this.dispatchEvent(new AddListPageEvent(event.pageModel.toPageThumbnail()));
    }

    private displayTypeChanged(event:Event) {
        const display = (event.target as HTMLSelectElement).value as PageListDisplay;
        this.dispatchEvent(new ChangePageListDisplayEvent(display));
    }

    static styles = [styles.icons, styles.form, css`
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
            position: relative;
        }
        hb-card {
            max-width: var(--hb-page-list-item-width);
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
  `];
}


const noop = () => {};


const renderVerticalCard = (contentState:IPageContentState, page:IPageThumbnail, index:number) => html`
    <hb-card
        .index=${index}
        draggable=${contentState.inContentEditMode ? true : false}
        @dragstart=${contentState.inContentEditMode ? pageDragStart : noop}
        @dragend=${contentState.inContentEditMode ? pageDragEnd : noop}
        @dragenter=${contentState.inContentEditMode ? pageDragEnter : noop}
        @dragleave=${contentState.inContentEditMode ? pageDragLeave : noop}
        media-url=${page.thumbUrl}
        media-href=${contentState.inContentEditMode ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}>
            ${renderDeleteIcon(contentState.inContentEditMode, index)}
    </hb-card>
`;

const renderHorizontalCard = (contentState:IPageContentState, page:IPageThumbnail, index:number) => html`
    <hb-horizontal-card
        .index=${index}
        draggable=${contentState.inContentEditMode ? true : false}
        @dragstart=${contentState.inContentEditMode ? pageDragStart : noop}
        @dragend=${contentState.inContentEditMode ? pageDragEnd : noop}
        @dragenter=${contentState.inContentEditMode ? pageDragEnter : noop}
        @dragleave=${contentState.inContentEditMode ? pageDragLeave : noop}
        media-url=${page.thumbUrl}
        media-href=${contentState.inContentEditMode ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}>
            ${renderDeleteIcon(contentState.inContentEditMode, index)}      
        </hb-horizontal-card>
`;


const renderTextOnly = (contentState:IPageContentState, page:IPageThumbnail, index:number) => html`
    <hb-card
        .index=${index}
        draggable=${contentState.inContentEditMode ? true : false}
        @dragstart=${contentState.inContentEditMode ? pageDragStart : noop}
        @dragend=${contentState.inContentEditMode ? pageDragEnd : noop}
        @dragenter=${contentState.inContentEditMode ? pageDragEnter : noop}
        @dragleave=${contentState.inContentEditMode ? pageDragLeave : noop}
        media-href=${contentState.inContentEditMode ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}>
        ${renderDeleteIcon(contentState.inContentEditMode, index)}
        </hb-card>
`;


const renderDeleteIcon = (inEditMode:boolean, index:number) => inEditMode ? html`
    <div class="delete-icon icon-button" title="Remove" @click=${(e:Event) => removePage(e, index)}>close</div>
` : html``;

const removePage = (event:Event, index:number) => {
    const target = event.target;
    target?.dispatchEvent(new RemovePageListItemEvent(index));
};


interface IIndexedElement extends HTMLElement {
    index:string
}


let dragSource:HTMLElement|null = null; 

// https://developer.mozilla.org/en-US/docs/Web/API/HTML_Drag_and_Drop_API/Drag_operations#draggableattribute
const pageDragStart = (event:DragEvent) => {
    const dt = event.dataTransfer!;
    const target = event.target as IIndexedElement;
    dragSource = target;
    target.style.opacity = "0.4";
    dt.effectAllowed = "move";
    dt.setData("application/harbor-app-page", target.index);
};

const pageDragEnd = (event:DragEvent) => {
    const target = event.target as HTMLElement;
    target.style.opacity = "1";
};

const pageDragEnter = (event:DragEvent) => {
    const target = event.target as HTMLElement;
    if (target !== dragSource && dragSource !== null) {
        // this looks okay but changes the indexes
        // target.insertAdjacentElement("afterend", dragSource);
        target.style.opacity = "0.2";
    }
};

const pageDragLeave = (event:DragEvent) => {
    const target = event.target as IIndexedElement;
    const dt = event.dataTransfer!;
    dt.dropEffect = "move";
    if (target !== dragSource) {
        target.style.opacity = "1";
    }
};

const pageListDragOver = (event:DragEvent) => {
    event.preventDefault();
    const dt = event.dataTransfer!;
    dt.dropEffect = "move";
};

const pageListDrop = (event:DragEvent) => {
    event.preventDefault();
    event.stopImmediatePropagation();
    const target = event.target as IIndexedElement;
    target.style.opacity = "1";
    const dt = event.dataTransfer!;
    const sourceIndex = parseInt(dt.getData("application/harbor-app-page"));
    const targetIndex = parseInt(target.index);
    console.log("REORDER", sourceIndex, targetIndex)
    target.dispatchEvent(new ReorderPageListItemsEvent(sourceIndex, targetIndex));
};



declare global {
    interface HTMLElementTagNameMap {
        'hb-page-list-content': PageListContent
    }
}
