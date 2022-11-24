import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../common/hb-content-editable";
import { ContentEditableChangeEvent } from "../../common/hb-content-editable";
import { SwitchChangeEvent } from "../../common/hb-switch";
import { contentTypes } from "../../domain/Pages/contentTypes";
import { sendFeedback } from "../../layout/feedback";
import "../../layout/hb-page-layout";
import { styles } from "../../styles";
import "../hb-add-page-dialog";
import { AddPageDialog } from "../hb-add-page-dialog";
import { PageAddedEvent } from "../hb-add-page-dialog/AddPageController";
import "../hb-delete-page-dialog";
import { DeletePageDialog } from "../hb-delete-page-dialog";
import "./hb-page-author-settings";
import "./hb-page-thumb-settings";
import { AddContentEvent, EditTabClickedEvent, IPageState, PageController, PageEditModeChangeEvent, UpdateShowSubtitleEvent, UpdateShowTitleEvent, UpdateSubtitleEvent } from "./PageController";


@customElement("hb-page")
export class HbPage extends LitElement {
    page:PageController = new PageController(this);

    get stateId() { return this.pathname; }

    @property({type: String})
    pathname!:string;

    @query("hb-add-page-dialog")
    $addPageDlg!:AddPageDialog;

    @query("hb-delete-page-dialog")
    $deletePageDialog!:DeletePageDialog;

    render() {
        const state = this.page.state;
        const page = state.page;

        return html`
            <hb-page-layout>
                ${renderAppBarButtons(this, state)}
                <div class="page-header">
                    ${state.inEditMode ? renderEditTabs(this, state) : html``}
                    <div ?hidden=${!state.isLoaded}>
                        <h1 class="display-medium" ?hidden=${!state.inEditMode && !page.showTitle}>${page.title}</h1>

                        ${state.inEditMode ? html`
                            <hb-content-editable
                                class="body-large"
                                value=${page.subtitle}
                                placeholder="Enter a subtitle"
                                @change=${this.subtitleChange}
                            ></hb-content-editable>                        
                        ` : html`
                            <div class="body-large" ?hidden=${!page.showSubtitle}>
                                ${page.subtitle}
                            </div>
                        `}
                    </div>
                </div>
                <div class="page-content">
                    ${state.isLoaded === false ? html`
                        <div>
                            Loading page...
                        </div>
                    ` : html``}
                    ${state.page.content.map((data, contentIndex) => contentTypes.get(data.contentType).render({
                        pathname: this.pathname,
                        contentIndex
                    }))}
                </div>
                ${renderAddContent(this, state)}
                <div class="page-bottom-spacer"></div>
            </hb-page-layout>
        `;
    }

    private subtitleChange(event:ContentEditableChangeEvent) {
        this.dispatchEvent(new UpdateSubtitleEvent(event.value));
    }

    addPageClicked() {
        this.$addPageDlg.showModal();
    }

    pageAdded(event:PageAddedEvent) {
        this.$addPageDlg.close();
        sendFeedback({
            message: "The page was added",
            actionText: "View",
            actionHref: event.pageModel.toPageThumbnail().href
        });     
    }

    editPageClicked() {
        this.dispatchEvent(new PageEditModeChangeEvent(true));
    }

    deletePageClicked() {
        this.$deletePageDialog.showModal();
    }

    doneButtonClicked() {
        this.dispatchEvent(new PageEditModeChangeEvent(false));
    }

    static styles = [styles.types, styles.format, styles.icons, styles.form, css`
        :host {
            display: block;
        }
        [hidden] {
            display: none;
        }
        h1.headline-large {
            margin-bottom: 1rem;
        }   

        .edit-tabs {
            display: flex;
            gap: 24px;
            margin-bottom: 1rem;
        }
        .edit-tab-content {
            background-color: var(--md-sys-color-surface-variant);
            border-radius:  var(--md-sys-shape-corner-medium);
            padding: 1rem;
            margin-bottom: 1rem;
        }

        .details-tab {
            display: flex;
        }
        .details-tab > :first-child {
            flex-grow: 1;
        }

        .edit-settings-tab-content {
            display: flex;
            gap: 48px;
            padding: 0 0 0 16px;
            justify-content: space-between;
        }
        .edit-settings-tab-content > :last-child {
            flex-grow: 1;
            text-align: right;
        }


        .switch-field {
            display: flex;
            gap: 32px;
            align-items: center;
        }
        .switch-field > :first-child {
            flex-grow: 1;
        }
        .switch-field:first-child {
            margin-bottom: 1rem;
        }
        .text-field:first-child {
            height: 32px;
            margin-bottom: 1rem;
        }

        .page-header {
            max-width: 750px;
            margin: auto;
        }
        .page-content{
            display:flex;
            flex-direction: column;
            padding: 1rem 0;
        }
        .page-content > * {
            margin-bottom: 36px;
        }
        .page-content > .empty {
            margin-bottom: 0;
        }

        .add-content {
            margin-top: 3rem;
        }
        .add-content-ctr {
            margin-top: 12px;
            display: grid;
            gap: 10px;
            grid-auto-flow: column;
            grid-auto-columns: 100px;
            grid-auto-rows: minmax(100px, auto);
        }
        .content-type {     
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 8px;
            padding-top: 24px;
            cursor: default;
            text-align: center;
            background-color: var(--md-sys-color-surface-variant);
            border-radius: var(--md-sys-shape-corner-small);
            border: 1px solid transparent;
            opacity: 0.5;
            transition: opacity 0.2s;
        }
        .content-type:hover {
            opacity: 1;
        }
        .content-type:active {
            opacity: 0.7;
        }

        .page-bottom-spacer {
            height: 200px;
        }
  `]
}

const renderAppBarButtons = (page:HbPage, state:IPageState) => html`
    <div slot="app-bar-buttons">
        <span
            ?hidden=${!state.currentUserCanEdit || state.inEditMode}
            class="icon-button icon-medium"
            tabindex="0"
            @click=${page.editPageClicked}
        >edit_document</span>
        <span
            ?hidden=${!state.currentUserCanAdd || state.inEditMode}
            class="icon-button icon-medium"
            tabindex="0"
            @click=${page.addPageClicked}
        >add_circle</span>
        <hb-button
            ?hidden=${!state.inEditMode}
            tonal
            label="Done"
            @hb-button-click=${page.doneButtonClicked}
        ></hb-button>
        <hb-add-page-dialog
            @page-added=${page.pageAdded}
        ></hb-add-page-dialog>
    </div>
`;

const renderEditTabs = (page:HbPage, state:IPageState) => html`
    <div class="edit-tabs">
        <hb-button           
            text-button
            label="Settings"
            ?selected=${state.selectedEditTab === "settings"}
            @click=${clickEditTab(page, "settings")}
        ></hb-button>
        <hb-button           
            text-button
            label="Thumbnail"
            ?selected=${state.selectedEditTab === "thumbnail"}
            @click=${clickEditTab(page, "thumbnail")}
        ></hb-button>
        <hb-button           
            text-button
            label="Details"
            ?selected=${state.selectedEditTab === "details"}
            @click=${clickEditTab(page, "details")}
        ></hb-button>
    </div>
    ${state.isLoaded ? renderEditTabContent(page, state) : html``}
`;


const clickEditTab = (page:HbPage, tab:string) => (event:Event) => {
    page.dispatchEvent(new EditTabClickedEvent(tab));
};

const renderEditTabContent = (page:HbPage, state:IPageState) => state.selectedEditTab === "settings" ? 
    renderEditSettingsTabContent(page, state) :
    state.selectedEditTab === "thumbnail" ?
        renderEditThumbnailTabContent(page, state) :
        state.selectedEditTab === "details" ?
            renderEditDetailsTabContent(page, state) :
            html``;


const renderEditSettingsTabContent = (page:HbPage, state:IPageState) => html`
    <div class="edit-tab-content">
        <div class="edit-settings-tab-content">
            <div>
                <div class="switch-field">
                    <div class="label-large">Show title</div>
                    <hb-switch
                        ?selected=${state.page.showTitle}
                        @hb-switch-change=${showTitleClicked(page)}
                    ></hb-switch>
                </div>
                <div class="switch-field">
                    <div class="label-large">Show subtitle</div>
                    <hb-switch
                        ?selected=${state.page.showSubtitle}
                        @hb-switch-change=${showSubtitleClicked(page)}
                    ></hb-switch>
                </div>
            </div>
            <div>
                <div class="switch-field">
                    <div class="label-large">Page size</div>
                    <select>
                        <option>Small</option>
                        <option>Medium</option>
                        <option>Large</option>
                        <option>Wide</option>
                        <option>Full</option>
                    </select>
                </div>                
            </div>
            <div>
                <hb-button
                    text-button
                    label="Delete Page"
                    @hb-button-click=${page.deletePageClicked}
                ></hb-button>
                <hb-delete-page-dialog
                    uid=${state.page.uid}
                ></hb-delete-page-dialog>
            </div>
        </div>            
    </div>
`;

const renderAddContent = (page:HbPage, state:IPageState) => {
    if (!state.inEditMode || !state.pageTemplate || state.pageTemplate.validContentTypes.length === 0) {
        return html``;
    }

    return html`
        <div class="add-content">
            <div class="body-large">Add Content</div>            
            <div class="add-content-ctr">                        
                ${state.pageTemplate.validContentTypes.map(contentTypeKey => {
                    const contentType = contentTypes.get(contentTypeKey);
                    return html`
                        <div class="content-type" title=${contentType.description} @click=${() => addContent(page, contentTypeKey)}>
                            <span class="material-symbols-outlined">${contentType.icon}</span>
                            <div class="body-large">${contentType.name}</div>
                        </div>                       
                    `;
                })}
            </div>
        </div>
    `;
};

const addContent = (page:HbPage, contentType:string) => 
    page.dispatchEvent(new AddContentEvent(contentType));


const showTitleClicked = (page:HbPage) => (event:SwitchChangeEvent) =>
    page.dispatchEvent(new UpdateShowTitleEvent(event.selected));


const showSubtitleClicked = (page:HbPage) => (event:SwitchChangeEvent) => 
    page.dispatchEvent(new UpdateShowSubtitleEvent(event.selected));


const renderEditThumbnailTabContent = (page:HbPage, state:IPageState) => {
    return html`
        <div class="edit-tab-content">
            <hb-page-thumb-settings-tab .state=${state}></hb-page-thumb-settings-tab>
        </div>
    `;
};

const renderEditDetailsTabContent = (page:HbPage, state:IPageState) => {
    return html`
        <div class="edit-tab-content details-tab">
            <hb-page-author-settings
                uid=${state.page.authorUid}           
            ></hb-page-author-settings>
            <div>
                <div class="text-field">
                    <div class="label-small">Page updated</div>
                    <div class="body=large">${state.page.dateUpdated.toLocaleDateString()}</div>
                </div>
                <div class="text-field">
                    <div class="label-small">Page added</div>
                    <div class="body=large">${state.page.dateCreated.toLocaleDateString()}</div>
                </div>
            </div>
        </div>
    `;
};
    

declare global {
    interface HTMLElementTagNameMap {
      "hb-page": HbPage
    }
}


