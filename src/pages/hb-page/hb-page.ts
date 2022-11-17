import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
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
import { DeletePageDialog } from "../hb-delete-page-dialog";
import "../hb-delete-page-dialog";
import "./hb-page-author-settings";
import { HbPageContent } from "./hb-page-content";
import "./hb-page-thumb-settings";
import { EditTabClickedEvent, IPageState, PageController, PageEditModeChangeEvent, UpdateShowSubtitleEvent, UpdateShowTitleEvent, UpdateSubtitleEvent } from "./PageController";


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
                ${state.inEditMode ? renderEditTabs(this, state) : html``}
                <div ?hidden=${!state.isLoaded}>
                    <h1 class="headline-large" ?hidden=${!state.inEditMode && !page.showTitle}>${page.title}</h1>

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
                <div class="page-content">
                    ${state.page.content.map((data, contentIndex) => contentTypes.get(data.contentType).render({
                        pathname: this.pathname,
                        contentIndex
                    }))}
                </div>
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

    static styles = [styles.types, styles.icons, css`
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


        .edit-settings-tab-content {
            display: flex;
            gap: 48px;
            padding: 0 0 0 16px;
            justify-content: space-between;
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
            label="Author"
            ?selected=${state.selectedEditTab === "author"}
            @click=${clickEditTab(page, "author")}
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
        state.selectedEditTab === "author" ?
            renderEditAuthorTabContent(page, state) :
            html``;


const renderEditSettingsTabContent = (page:HbPage, state:IPageState) => html`
    <div class="edit-tab-content">
        <div class="edit-settings-tab-content">
            <div>
                <div class="switch-field">
                    <div>Show title</div>
                    <hb-switch
                        ?selected=${state.page.showTitle}
                        @hb-switch-change=${showTitleClicked(page)}
                    ></hb-switch>
                </div>
                <div class="switch-field">
                    <div>Show subtitle</div>
                        <hb-switch
                        ?selected=${state.page.showSubtitle}
                        @hb-switch-change=${showSubtitleClicked(page)}
                    ></hb-switch>
                </div>
            </div>
            <div>
                <div class="text-field">
                    <div class="label-large">Page updated</div>
                    <div class="body=large">${state.page.dateUpdated.toLocaleDateString()}</div>
                </div>
                <div class="text-field">
                    <div class="label-large">Page added</div>
                    <div class="body=large">${state.page.dateCreated.toLocaleDateString()}</div>
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

const renderEditAuthorTabContent = (page:HbPage, state:IPageState) => {
    return html`
        <div class="edit-tab-content">
            <hb-page-author-settings
                uid=${state.page.authorUid}           
            ></hb-page-author-settings>
        </div>
    `;
};
    

declare global {
    interface HTMLElementTagNameMap {
      "hb-page": HbPage
    }
}


