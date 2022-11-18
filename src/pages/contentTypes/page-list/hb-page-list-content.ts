import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../../styles";
import { HbPageContent } from "../../hb-page";
import { AddListPageEvent, ChangePageListDisplayEvent, PageListContentController } from "./PageListContentController";
import "../../../common/hb-button";
import "../../../common/hb-card";
import { DEFAULT_IMAGE_URL } from "../image/imageContentType";
import { PageListContentData, PageListDisplay } from "./pageListContentType";
import { IPageThumbnail } from "../../../domain/interfaces/PageInterfaces";
import { FindPageDialog, PageSelectedEvent } from "../../hb-find-page-dialog";
import { IPageContentState } from "../../hb-page/PageContentController";

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
        return html`
            <div class="page-list">
                ${state.pages.map(page => state.display === PageListDisplay.horizontalCard ?
                    renderHorizontalCard(contentState, page) : state.display === PageListDisplay.verticalCard ?
                        renderVerticalCard(contentState, page) :
                        renderTextOnly(contentState, page)
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
          
        }
        hb-card {
            max-width: var(--hb-page-list-item-width);
        }
        label {
            margin-right: 8px;
        }
  `];
}


const renderVerticalCard = (contentState:IPageContentState, page:IPageThumbnail) => html`
    <hb-card
        media-url=${page.thumbUrl}
        media-href=${contentState.isActive ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}
    ></hb-card>
`;

const renderHorizontalCard = (contentState:IPageContentState, page:IPageThumbnail) => html`
    <hb-horizontal-card
        media-url=${page.thumbUrl}
        media-href=${contentState.isActive ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}
    ></hb-horizontal-card>
`;

const renderTextOnly = (contentState:IPageContentState, page:IPageThumbnail) => html`
    <hb-card
        media-href=${contentState.isActive ? "javascript:;" : page.href}
        text=${page.title}
        description=${page.thumbDescription}
    ></hb-card>
`;



declare global {
    interface HTMLElementTagNameMap {
        'hb-page-list-content': PageListContent
    }
}
