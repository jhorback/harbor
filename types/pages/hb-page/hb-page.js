var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../common/hb-content-editable";
import { contentTypes } from "../../domain/Pages/contentTypes";
import { sendFeedback } from "../../layout/feedback";
import "../../layout/hb-page-layout";
import { styles } from "../../styles";
import "../hb-add-page-dialog";
import "../hb-delete-page-dialog";
import "./hb-page-author-settings";
import "./hb-page-thumb-settings";
import { AddContentEvent, EditTabClickedEvent, PageController, PageEditModeChangeEvent, UpdatePageSizeEvent, UpdatePageVisibilityEvent, UpdateShowSubtitleEvent, UpdateShowTitleEvent, UpdateSubtitleEvent } from "./PageController";
let HbPage = class HbPage extends LitElement {
    constructor() {
        super(...arguments);
        this.page = new PageController(this);
    }
    get stateId() { return this.pathname; }
    render() {
        const state = this.page.state;
        const page = state.page;
        return html `
            <hb-page-layout size=${state.page.pageSize}>
                ${renderAppBarButtons(this, state)}
                ${state.inEditMode ? renderEditTabs(this, state) : html ``}

                <div class="page-header">
                    
                    <div xhidden=${!state.isLoaded} class="page-header-content">
                        <h1 class="display-medium" ?hidden=${!state.inEditMode && !page.showTitle}>${page.displayTitle}</h1>

                        ${state.inEditMode ? html `
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
                </div>
                <div class="page-content">
                    ${state.isLoaded === false ? html `
                        <div>
                            <!-- Loading page... -->
                        </div>
                    ` : html ``}
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
    subtitleChange(event) {
        this.dispatchEvent(new UpdateSubtitleEvent(event.value));
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
        this.dispatchEvent(new PageEditModeChangeEvent(true));
    }
    deletePageClicked() {
        this.$deletePageDialog.showModal();
    }
    doneButtonClicked() {
        this.dispatchEvent(new PageEditModeChangeEvent(false));
    }
};
HbPage.styles = [styles.types, styles.format, styles.icons, styles.form, css `
        :host {
            display: block;
        }
        [hidden] {
            display: none;
        }


        .edit-tabs,
        .edit-tab-content {
            max-width: var(--hb-page-layout-small);
            margin: auto;
            margin-bottom: 1rem;
        }
        .edit-tabs {
            display: flex;
            gap: 24px;
        }
        .edit-tab-content {
            background-color: var(--md-sys-color-surface-variant);
            border-radius:  var(--md-sys-shape-corner-medium);
            padding: 1rem;            
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
            display: flex;
            flex-direction: column;
            justify-content: center;
            max-width: var(--hb-page-layout-wide);
            xxx-min-height: 200px;
            margin: auto;
            padding: 56px;
            background-color: var(--md-sys-color-surface);
            border-radius: var(--md-sys-shape-corner-large);
        }
        .page-header-content {
            max-width: var(--hb-page-layout-small);
        }
        .page-content{
            display:flex;
            flex-direction: column;
            margin: auto;
            max-width: var(--hb-page-layout-medium);
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
            max-width: var(--hb-page-layout-medium);
            margin: auto;
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
  `];
__decorate([
    property({ type: String })
], HbPage.prototype, "pathname", void 0);
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
const renderEditTabs = (page, state) => html `
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
    ${state.isLoaded ? renderEditTabContent(page, state) : html ``}
`;
const clickEditTab = (page, tab) => (event) => {
    page.dispatchEvent(new EditTabClickedEvent(tab));
};
const renderEditTabContent = (page, state) => state.selectedEditTab === "settings" ?
    renderEditSettingsTabContent(page, state) :
    state.selectedEditTab === "thumbnail" ?
        renderEditThumbnailTabContent(page, state) :
        state.selectedEditTab === "details" ?
            renderEditDetailsTabContent(page, state) :
            html ``;
const renderEditSettingsTabContent = (page, state) => html `
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
                    <select
                        class="small"
                        .value=${state.page.pageSize}
                        @change=${pageSizeChanged(page)}>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="large">Large</option>
                        <option value="wide">Wide</option>
                        <option value="full">Full</option>
                    </select>
                </div>
                <div class="switch-field">
                    <div class="label-large">Is visible?</div>
                    <hb-switch
                        ?selected=${state.page.isVisible}
                        @hb-switch-change=${isVisibleClicked(page)}
                    ></hb-switch>
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
const renderAddContent = (page, state) => {
    if (!state.inEditMode || !state.pageTemplate || state.pageTemplate.validContentTypes.length === 0) {
        return html ``;
    }
    return html `
        <div class="add-content">
            <div class="body-large">Add Content</div>            
            <div class="add-content-ctr">                        
                ${state.pageTemplate.validContentTypes.map(contentTypeKey => {
        const contentType = contentTypes.get(contentTypeKey);
        return html `
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
const addContent = (page, contentType) => page.dispatchEvent(new AddContentEvent(contentType));
const showTitleClicked = (page) => (event) => page.dispatchEvent(new UpdateShowTitleEvent(event.selected));
const showSubtitleClicked = (page) => (event) => page.dispatchEvent(new UpdateShowSubtitleEvent(event.selected));
const pageSizeChanged = (page) => (event) => page.dispatchEvent(new UpdatePageSizeEvent(event.target.value));
const isVisibleClicked = (page) => (event) => page.dispatchEvent(new UpdatePageVisibilityEvent(event.selected));
const renderEditThumbnailTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            <hb-page-thumb-settings-tab .state=${state}></hb-page-thumb-settings-tab>
        </div>
    `;
};
const renderEditDetailsTabContent = (page, state) => {
    return html `
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
