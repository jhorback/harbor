import { css, html, LitElement } from "lit";
import { ifDefined } from "lit-html/directives/if-defined.js";
import { customElement, property, query } from "lit/decorators.js";
import "../../../common/hb-button";
import "../../../common/hb-card";
import { IPageThumbnail } from "../../../domain/interfaces/PageInterfaces";
import { styles } from "../../../styles";
import { AddPageDialog, PageAddedEvent } from "../../hb-add-page-dialog";
import { FindPageDialog, PageSelectedEvent } from "../../hb-find-page-dialog";
import { HbPageContent } from "../../hb-page";
import { DEFAULT_IMAGE_URL } from "../image/imageContentType";
import { DragOrderController } from "../../../common/DragOrderController";
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
    dragOrderController:DragOrderController = new DragOrderController(this);

    @query(".page-list.editable")
    $editablePageList!:Element;

    @query("hb-page-content")
    $hbPageContent!:HbPageContent;

    @query("hb-find-page-dialog")
    $findPageDialog!:FindPageDialog;

    @query("hb-add-page-dialog")
    $addPageDialog!:AddPageDialog;

    render() {
        const state = this.pageListContent.content;
        const contentState = this.pageListContent.contentState;
        return html`
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${!state.pages || state.pages.length === 0}>                
                <div>
                    ${state.pages.length === 0 ? html`` : this.renderPages("")}
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

    private renderDefault() {
        return html`
            <hb-card
                media-url=${DEFAULT_IMAGE_URL}
                text="Add Page"
                description="Add a new page or search for an existing page to add"
            ></hb-card>
        `;
    }

    private renderPages(className:string) {
        const state = this.pageListContent.content;
        const size = this.pageListContent.page.state.page.pageSize;
        return html`
            <div class=${["page-list", className].join(" ")}
                page-size=${size}>
                ${state.pages.map((page, index) => state.display === PageListDisplay.horizontalCard ?
                    this.renderHorizontalCard(page, index) : state.display === PageListDisplay.verticalCard ?
                        this.renderVerticalCard(page, index) :
                        this.renderTextOnly(page, index)
                )}
            </div>
        `;
    }

    private renderVerticalCard(page:IPageThumbnail, index:number) {
        const inContentEditMode = this.pageListContent.contentState.inContentEditMode;
        return html`
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

    private renderHorizontalCard(page:IPageThumbnail, index:number)  {
        const inContentEditMode = this.pageListContent.contentState.inContentEditMode;
        return html`
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

    private renderTextOnly(page:IPageThumbnail, index:number) {
        const inContentEditMode = this.pageListContent.contentState.inContentEditMode;
        return html`
            <hb-card
                visibility=${this.pageListContent.getPageVisibility(page.isVisible)}
                media-href=${inContentEditMode ? "javascript:;" : page.href}
                text=${page.title}
                description=${ifDefined(page.thumbDescription === null ? undefined : page.thumbDescription)}>
                ${renderDeleteIcon(inContentEditMode, index)}
            </hb-card>
        `;
    }

    private clickedEmpty() {
        this.$hbPageContent.edit();
    }

    private addNewPage() {
        this.$addPageDialog.showModal();
    }

    private searchForPage() {
       this.$findPageDialog.showModal();
    }

    private pageSelected(event:PageSelectedEvent) {
        this.dispatchEvent(new AddListPageEvent(event.pageModel.toPageThumbnail()));
    }

    private pageAdded(event:PageAddedEvent) {
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
  `];
}


const renderDeleteIcon = (inEditMode:boolean, index:number) => inEditMode ? html`
    <div class="delete-icon icon-button" title="Remove" @click=${(e:Event) => removePage(e, index)}>close</div>
` : html``;

const removePage = (event:Event, index:number) => {
    const target = event.target;
    target?.dispatchEvent(new RemovePageListItemEvent(index));
};

declare global {
    interface HTMLElementTagNameMap {
        'hb-page-list-content': PageListContent
    }
}
