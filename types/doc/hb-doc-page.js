var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "../styles";
import { docTypes } from "../domain/Doc/docTypes";
import { DocData } from "./data/hb-doc-data";
import { linkProp } from "@domx/dataelement";
import "../layout/hb-page-layout";
import "../common/hb-button";
/**
 *
 */
let HbDocPage = class HbDocPage extends LitElement {
    constructor() {
        super(...arguments);
        this.docType = docTypes.doc.type;
        this.state = DocData.defaultState;
        this.inEditMode = true;
        this.selectedEditTab = "";
    }
    get uid() { return `${this.docType}:${this.pid}`; }
    render() {
        return html `
            <hb-doc-data
                uid=${this.uid}
                @state-changed=${linkProp(this, "state")}
            ></hb-doc-data>     
            <hb-page-layout>
                ${renderAppBarButtons(this, this.state)}
                ${this.inEditMode ? renderEditTabs(this, this.state) : html ``}
                <div ?hidden=${!this.state.isLoaded}>
                    <h1>${this.state.doc.title}</h1>
                    Test document, pid = <span class="primary-text">${this.pid}</span>
                    uid = <span class="primary-text">${this.uid}</span>
                    <p>
                        <a href="/bad-link">Bad Link</a> |
                        <a href="/docs/foo-bar-baz">Bad Docs Link</a> |
                        <a href="/docs/new-home">NEW HOME</a> |
                        <a href=" /docs/john-g-home">JOHN G HOME</a>               
                        
                    </p>
                </div>
                
            </hb-page-layout>
        `;
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
    ${renderEditTabContent(page, state)}
`;
const renderEditTabContent = (page, state) => page.selectedEditTab === "settings" ?
    renderEditSettingsTabContent(page, state) :
    page.selectedEditTab === "thumbnail" ?
        renderEditThumbnailTabContent(page, state) :
        page.selectedEditTab === "author" ?
            renderEditAuthorTabContent(page, state) :
            html ``;
const renderEditSettingsTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            Edit Settings Tab Content
        </div>
    `;
};
const renderEditThumbnailTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            Edit Thumbnail Tab Content
        </div>
    `;
};
const renderEditAuthorTabContent = (page, state) => {
    return html `
        <div class="edit-tab-content">
            Edit Author Tab Content
        </div>
    `;
};
const clickEditTab = (page, tab) => (event) => {
    const nextTab = page.selectedEditTab === tab ? "" : tab;
    page.selectedEditTab = nextTab;
};
