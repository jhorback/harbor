var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import "../../common/hb-content-editable";
import { contentTypes } from "../../domain/Pages/contentTypes";
import { sendFeedback } from "../../layout/feedback";
import "../../layout/hb-page-layout";
import { styles } from "../../styles";
import "../hb-add-page-dialog";
import "../hb-delete-page-dialog";
import "./hb-page-author-settings";
import "./hb-page-thumb-settings";
import { PageController, UpdateShowSubtitleEvent, UpdateShowTitleEvent, UpdateSubtitleEvent } from "./PageController";
export class PageEditModeChangeEvent extends Event {
    constructor(inEditMode) {
        super(PageEditModeChangeEvent.eventType, { bubbles: false });
        this.inEditMode = inEditMode;
    }
}
PageEditModeChangeEvent.eventType = "page-edit-mode-change";
export class ContentEmptyEvent extends Event {
    constructor(host, isEmpty) {
        super(ContentEmptyEvent.eventType, { bubbles: true, composed: true });
        this.host = host;
        this.isEmpty = isEmpty;
    }
}
ContentEmptyEvent.eventType = "content-empty";
export class ContentActiveChangeEvent extends Event {
    constructor(activeContent, active) {
        super(ContentActiveChangeEvent.eventType, { bubbles: true, composed: true });
        this.activeContent = activeContent;
        this.active = active;
    }
}
ContentActiveChangeEvent.eventType = "content-active-change";
let HbPage = class HbPage extends LitElement {
    constructor() {
        super(...arguments);
        this.page = new PageController(this);
        this.inEditMode = false;
        this.selectedEditTab = "";
        this.activeContent = null;
    }
    get stateId() { return this.pathname; }
    render() {
        const state = this.page.state;
        const page = state.page;
        return html `
            <hb-page-layout>
                ${renderAppBarButtons(this, state)}
                ${this.inEditMode ? renderEditTabs(this, state) : html ``}
                <div ?hidden=${!state.isLoaded}>
                    <h1 class="headline-large" ?hidden=${!this.inEditMode && !page.showTitle}>${page.title}</h1>

                    ${this.inEditMode ? html `
                        <hb-content-editable
                            class="body-large"
                            value=${page.subtitle}
                            placeholder="Enter a subtitle"
                            @change=${this.subtitleChange}
                        ></hb-content-editable>                        
                    ` : html `
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
    subtitleChange(event) {
        this.dispatchEvent(new UpdateSubtitleEvent(event.value));
    }
    contentEmpty(event) {
        event.host.className = !this.inEditMode && event.isEmpty ?
            "empty" : "";
    }
    addPageClicked() {
        this.$addPageDlg.showModal();
    }
    pageAdded(event) {
        this.$addPageDlg.close();
        sendFeedback({
            message: "The page was added",
            actionText: "View",
            actionHref: event.pageModel.toPageThumbnail().href
        });
    }
    editPageClicked() {
        this.inEditMode = true;
        this.dispatchEditModeChange();
    }
    deletePageClicked() {
        this.$deletePageDialog.showModal();
    }
    doneButtonClicked() {
        this.selectedEditTab = "";
        this.inEditMode = false;
        this.closeActiveContent();
        this.dispatchEditModeChange();
    }
    contentActive(event) {
        this.closeActiveContent();
        if (event.active) {
            this.activeContent = event.activeContent;
            this.activeContent.isActive = true;
        }
    }
    closeActiveContent() {
        if (this.activeContent) {
            this.activeContent.isActive = false;
            this.activeContent.contentEdit = false;
        }
    }
    dispatchEditModeChange() {
        this.dispatchEvent(new PageEditModeChangeEvent(this.inEditMode));
    }
};
HbPage.styles = [styles.types, styles.icons, css `
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
  `];
__decorate([
    property({ type: String })
], HbPage.prototype, "pathname", void 0);
__decorate([
    state()
], HbPage.prototype, "inEditMode", void 0);
__decorate([
    state()
], HbPage.prototype, "selectedEditTab", void 0);
__decorate([
    query("hb-add-page-dialog")
], HbPage.prototype, "$addPageDlg", void 0);
__decorate([
    query("hb-delete-page-dialog")
], HbPage.prototype, "$deletePageDialog", void 0);
HbPage = __decorate([
    customElement("hb-page")
], HbPage);
export { HbPage };
const renderAppBarButtons = (page, state) => html `
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
const renderEditTabs = (page, state) => html `
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
    ${state.isLoaded ? renderEditTabContent(page, state) : html ``}
`;
const clickEditTab = (page, tab) => (event) => {
    const nextTab = page.selectedEditTab === tab ? "" : tab;
    page.selectedEditTab = nextTab;
};
const renderEditTabContent = (page, state) => page.selectedEditTab === "settings" ?
    renderEditSettingsTabContent(page, state) :
    page.selectedEditTab === "thumbnail" ?
        renderEditThumbnailTabContent(page, state) :
        page.selectedEditTab === "author" ?
            renderEditAuthorTabContent(page, state) :
            html ``;
const renderEditSettingsTabContent = (page, state) => html `
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
const showTitleClicked = (page) => (event) => page.dispatchEvent(new UpdateShowTitleEvent(event.selected));
const showSubtitleClicked = (page) => (event) => page.dispatchEvent(new UpdateShowSubtitleEvent(event.selected));
const renderEditThumbnailTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            <hb-page-thumb-settings-tab .state=${state}></hb-page-thumb-settings-tab>
        </div>
    `;
};
const renderEditAuthorTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            <hb-page-author-settings
                uid=${state.page.authorUid}           
            ></hb-page-author-settings>
        </div>
    `;
};
