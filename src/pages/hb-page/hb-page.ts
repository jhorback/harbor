import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import "../../layout/hb-page-layout";
import { styles } from "../../styles";
import "../hb-add-page-dialog";
import { AddPageDialog } from "../hb-add-page-dialog";
import { ContentEditableChangeEvent } from "../../common/hb-content-editable";
import { SwitchChangeEvent } from "../../common/hb-switch";
import { contentTypes } from "../../domain/Pages/contentTypes";
import { sendFeedback } from "../../layout/feedback";
import { PageAddedEvent } from "../hb-add-page-dialog/AddPageController";
import { HbPageContent } from "./hb-page-content";
import { IPageState, PageController, UpdateShowSubtitleEvent, UpdateShowTitleEvent, UpdateSubtitleEvent } from "./PageController";


export class PageEditModeChangeEvent extends Event {
    static eventType = "page-edit-mode-change";
    inEditMode:boolean;
    constructor(inEditMode:boolean) {
        super(PageEditModeChangeEvent.eventType, {bubbles: false});
        this.inEditMode = inEditMode;
    }
}

export class ContentEmptyEvent extends Event {
    static eventType = "content-empty";
    host:Element;
    isEmpty:boolean;
    constructor(host:Element, isEmpty:boolean) {
        super(ContentEmptyEvent.eventType, {bubbles: true, composed:true});
        this.host = host;
        this.isEmpty = isEmpty;
    }
}

export class ContentActiveChangeEvent extends Event {
    static eventType = "content-active-change";
    activeContent:HbPageContent;
    active:boolean;
    constructor(activeContent:HbPageContent, active:boolean) {
        super(ContentActiveChangeEvent.eventType, {bubbles: true, composed: true});
        this.activeContent = activeContent;
        this.active = active;
    }
}


@customElement("hb-page")
export class HbPage extends LitElement {
    page:PageController = new PageController(this);

    get stateId() { return this.pathname; }

    @property({type: String})
    pathname!:string;

    @state()
    inEditMode = false;

    @state()
    selectedEditTab:string = "";

    @query("hb-add-page-dialog")
    $addPageDlg!:AddPageDialog;

    // @query("hb-delete-page-dialog")
    // $deletePagetDialog!:DeletePageDialog;

    render() {
        const state = this.page.state;
        const page = state.page;

        return html`
            <hb-page-layout>
                ${renderAppBarButtons(this, state)}
                ${this.inEditMode ? renderEditTabs(this, state) : html``}
                <div ?hidden=${!state.isLoaded}>
                    <h1 class="headline-large" ?hidden=${!this.inEditMode && !page.showTitle}>${page.title}</h1>

                    ${this.inEditMode ? html`
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
                <div class="page-content"
                    @content-active-change=${this.contentActive}
                    @content-empty=${this.contentEmpty}
                >
                    ${state.page.content.map((data, contentIndex) => contentTypes.get(data.contentType).render({
                        pathname: this.pathname,
                        contentIndex,
                        data
                    }))}
                </div>
            </hb-page-layout>
        `;
    }

    private subtitleChange(event:ContentEditableChangeEvent) {
        this.shadowRoot?.dispatchEvent(new UpdateSubtitleEvent(event.value));
    }

    private contentEmpty(event:ContentEmptyEvent) {
        event.host.className = !this.inEditMode && event.isEmpty ?
            "empty" : "";
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
        alert("edit page");
        // this.inEditMode = true;
        // this.dispatchEditModeChange();
    }

    deletePageClicked() {
        alert("delete page");
        // this.$deleteDocumentDialog.open = true;
    }

    doneButtonClicked() {
        this.selectedEditTab = "";
        this.inEditMode = false;
        this.closeActiveContent();
        this.dispatchEditModeChange();
    }

    private activeContent:HbPageContent|null = null;

    private contentActive(event:ContentActiveChangeEvent) {
        this.closeActiveContent();
        if (event.active) {
            this.activeContent = event.activeContent;
            this.activeContent.isActive = true;
        }   
    }

    private closeActiveContent() {
        if(this.activeContent) {
            this.activeContent.isActive = false;
            this.activeContent.contentEdit = false;
        }
    }

    private dispatchEditModeChange() {
        this.dispatchEvent(new PageEditModeChangeEvent(this.inEditMode));
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
            ?hidden=${!state.currentUserCanEdit || page.inEditMode}
            class="icon-button icon-medium"
            tabindex="0"
            @click=${page.editPageClicked}
        >edit_document</span>
        <span
            ?hidden=${!state.currentUserCanAdd || page.inEditMode}
            class="icon-button icon-medium"
            tabindex="0"
            @click=${page.addPageClicked}
        >add_circle</span>
        <hb-button
            ?hidden=${!page.inEditMode}
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
            ?selected=${page.selectedEditTab === "settings"}
            @click=${clickEditTab(page, "settings")}
        ></hb-button>
        <hb-button           
            text-button
            label="Thumbnail"
            ?selected=${page.selectedEditTab === "thumbnail"}
            @click=${clickEditTab(page, "thumbnail")}
        ></hb-button>
        <hb-button           
            text-button
            label="Author"
            ?selected=${page.selectedEditTab === "author"}
            @click=${clickEditTab(page, "author")}
        ></hb-button>
    </div>
    ${state.isLoaded ? renderEditTabContent(page, state) : html``}
`;

const clickEditTab = (page:HbPage, tab:string) => (event:Event) => {
    const nextTab = page.selectedEditTab === tab ? "" : tab;
    page.selectedEditTab = nextTab;
};

const renderEditTabContent = (page:HbPage, state:IPageState) => page.selectedEditTab === "settings" ? 
    renderEditSettingsTabContent(page, state) :
    page.selectedEditTab === "thumbnail" ?
        renderEditThumbnailTabContent(page, state) :
        page.selectedEditTab === "author" ?
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
    page.shadowRoot?.dispatchEvent(new UpdateShowTitleEvent(event.selected));


const showSubtitleClicked = (page:HbPage) => (event:SwitchChangeEvent) => 
    page.shadowRoot?.dispatchEvent(new UpdateShowSubtitleEvent(event.selected));


const renderEditThumbnailTabContent = (page:HbPage, state:IPageState) => {
    // jch - need update
    return html`
        <div class="edit-tab-content">
            <hb-doc-thumb-settings-tab .state=${state}></hb-doc-thumb-settings-tab>
        </div>
    `;
};

const renderEditAuthorTabContent = (page:HbPage, state:IPageState) => {
    // jch - need update
    return html`
        <div class="edit-tab-content">
            <hb-doc-author 
                uid=${state.page.authorUid}           
            ></hb-doc-author>
        </div>
    `;
};
    

declare global {
    interface HTMLElementTagNameMap {
      "hb-page": HbPage
    }
}


