var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import { docTypes } from "../domain/Doc/docTypes";
import { linkProp } from "@domx/dataelement";
import "../layout/hb-page-layout";
import "../common/hb-button";
import "../common/hb-switch";
import "../common/hb-content-editable";
import { DocData, UpdateShowSubtitleEvent, UpdateShowTitleEvent, UpdateSubtitleEvent } from "./data/hb-doc-data";
/**
 *
 */
let HbDocPage = class HbDocPage extends LitElement {
    constructor() {
        super(...arguments);
        this.docType = docTypes.doc.type;
        this.state = DocData.defaultState;
        this.inEditMode = false;
        this.selectedEditTab = "";
    }
    get uid() { return `${this.docType}:${this.pid}`; }
    render() {
        const doc = this.state.doc;
        const placeholder = "Enter a subtitle";
        return html `
            <hb-doc-data
                uid=${this.uid}
                @state-changed=${linkProp(this, "state")}
            ></hb-doc-data>     
            <hb-page-layout>
                ${renderAppBarButtons(this, this.state)}
                ${this.inEditMode ? renderEditTabs(this, this.state) : html ``}
                <div ?hidden=${!this.state.isLoaded}>
                    <h1 class="headline-large" ?hidden=${!this.inEditMode && !doc.showTitle}>${doc.title}</h1>

                    ${this.inEditMode ? html `
                        <hb-content-editable
                            class="body-large"
                            value=${doc.subtitle}
                            placeholder=${placeholder}
                            @change=${this.subtitleChange}
                        ></hb-content-editable>
                        
                    ` : html `
                        <div class="body-large" ?hidden=${!doc.showSubtitle}>
                            ${doc.subtitle}
                        </div>
                    `}
                </div>
            </hb-page-layout>
        `;
    }
    subtitleChange(event) {
        this.$hbDocData.dispatchEvent(new UpdateSubtitleEvent(event.value));
    }
    addDocumentClicked() {
        alert("add");
    }
    editDocumentClicked() {
        this.inEditMode = true;
    }
    doneButtonClicked() {
        this.selectedEditTab = "";
        this.inEditMode = false;
    }
};
HbDocPage.styles = [styles.types, styles.icons, css `
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
            padding: 0 32px 0 16px;
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
  `];
__decorate([
    property({ type: String })
], HbDocPage.prototype, "pid", void 0);
__decorate([
    property({ type: Object, attribute: false })
], HbDocPage.prototype, "state", void 0);
__decorate([
    state()
], HbDocPage.prototype, "inEditMode", void 0);
__decorate([
    state()
], HbDocPage.prototype, "selectedEditTab", void 0);
__decorate([
    query("hb-doc-data")
], HbDocPage.prototype, "$hbDocData", void 0);
HbDocPage = __decorate([
    customElement('hb-doc-page')
], HbDocPage);
export { HbDocPage };
const renderAppBarButtons = (page, state) => html `
    <div slot="app-bar-buttons">
        <span
            ?hidden=${!state.currentUserCanEdit || page.inEditMode}
            class="icon-button icon-medium"
            tabindex="0"
            @click=${page.editDocumentClicked}
        >edit_document</span>
        <span
            ?hidden=${!state.currentUserCanAdd || page.inEditMode}
            class="icon-button icon-medium"
            tabindex="0"
            @click=${page.addDocumentClicked}
        >add_circle</span>
        <hb-button
            ?hidden=${!page.inEditMode}
            tonal
            label="Done"
            @hb-button-click=${page.doneButtonClicked}
        ></hb-button>
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
                        ?selected=${state.doc.showTitle}
                        @hb-switch-change=${showTitleClicked(page)}
                    ></hb-switch>
                </div>
                <div class="switch-field">
                    <div>Show subtitle</div>
                        <hb-switch
                        ?selected=${state.doc.showSubtitle}
                        @hb-switch-change=${showSubtitleClicked(page)}
                    ></hb-switch>
                </div>
            </div>
            <div>
                <div class="text-field">
                    <div class="label-large">Document updated</div>
                    <div class="body=large">${state.doc.dateUpdated.toLocaleDateString()}</div>
                </div>
                <div class="text-field">
                    <div class="label-large">Document created</div>
                    <div class="body=large">${state.doc.dateCreated.toLocaleDateString()}</div>
                </div>
            </div>
        </div>            
    </div>
`;
const showTitleClicked = (page) => (event) => page.$hbDocData.dispatchEvent(new UpdateShowTitleEvent(event.selected));
const showSubtitleClicked = (page) => (event) => page.$hbDocData.dispatchEvent(new UpdateShowSubtitleEvent(event.selected));
const renderEditThumbnailTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            <pre style="margin:0;">
                Set thumb
                Thumb description
                Image
                Use subtitle as thumb description</pre>
        </div>
    `;
};
const renderEditAuthorTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            <pre style="margin:0">
                Author Avatar
                Author Name
                Author Email
                Author Last Login</pre>
        </div>
    `;
};
const clickEditTab = (page, tab) => (event) => {
    const nextTab = page.selectedEditTab === tab ? "" : tab;
    page.selectedEditTab = nextTab;
};
