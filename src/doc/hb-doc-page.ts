import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import { docTypes } from "../domain/Doc/docTypes";
import { DocData, IDocDataState, UpdateShowSubtitleEvent, UpdateShowTitleEvent } from "./data/hb-doc-data";
import { linkProp } from "@domx/dataelement";
import "../layout/hb-page-layout";
import "../common/hb-button";
import "../common/hb-switch";
import { SwitchChangeEvent } from "../common/hb-switch";
import "../common/hb-content-editable";
import { ContentEditableChangeEvent } from "../common/hb-content-editable";


/**
 * 
 */
@customElement('hb-doc-page')
export class HbDocPage extends LitElement {

    docType:string = docTypes.doc.type;

    @property({type: String})
    pid!:String;

    get uid() { return `${this.docType}:${this.pid}`; }

    @property({type: Object, attribute: false})
    state:IDocDataState = DocData.defaultState;

    @state()
    inEditMode = true;

    @state()
    selectedEditTab:string = "settings";

    @query("hb-doc-data")
    $hbDocData!:DocData;

    render() {
        const doc = this.state.doc;
        const placeholder = "Enter a subtitle";

        return html`
            <hb-doc-data
                uid=${this.uid}
                @state-changed=${linkProp(this, "state")}
            ></hb-doc-data>     
            <hb-page-layout>
                ${renderAppBarButtons(this, this.state)}
                ${this.inEditMode ? renderEditTabs(this, this.state) : html``}
                <div ?hidden=${!this.state.isLoaded}>
                    <h1 class="headline-large" ?hidden=${!this.inEditMode && !doc.showTitle}>${doc.title}</h1>

                    ${this.inEditMode ? html`
                        <hb-content-editable
                            class="body-large"
                            value=${doc.subtitle}
                            placeholder=${placeholder}
                            @change=${this.subtitleChange}
                        ></hb-content-editable>
                        
                    ` : html`
                        <div class="body-large" ?hidden=${!doc.showSubtitle}>
                            ${doc.subtitle}
                        </div>
                    `}
 
                    <p>
                        Test document, pid = <span class="primary-text">${this.pid}</span>
                        uid = <span class="primary-text">${this.uid}</span>
                        <a href="/bad-link">Bad Link</a> |
                        <a href="/docs/foo-bar-baz">Bad Docs Link</a> |
                        <a href="/docs/new-home">NEW HOME</a> |
                        <a href=" /docs/john-g-home">JOHN G HOME</a>
                    </p>
                </div>
            </hb-page-layout>
        `;
    }

    subtitleChange(event:ContentEditableChangeEvent) {
        console.log("SUBTITLE CHANGE:", `"${event.value}"`);
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

    static styles = [styles.types, styles.icons, css`
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
  `]
}


const renderAppBarButtons = (page:HbDocPage, state:IDocDataState) => html`
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

const renderEditTabs = (page:HbDocPage, state:IDocDataState) => html`
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


const renderEditTabContent = (page:HbDocPage, state:IDocDataState) => page.selectedEditTab === "settings" ? 
    renderEditSettingsTabContent(page, state) :
    page.selectedEditTab === "thumbnail" ?
        renderEditThumbnailTabContent(page, state) :
        page.selectedEditTab === "author" ?
            renderEditAuthorTabContent(page, state) :
            html``;



const renderEditSettingsTabContent = (page:HbDocPage, state:IDocDataState) => html`
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


const showTitleClicked = (page:HbDocPage) => (event:SwitchChangeEvent) =>
    page.$hbDocData.dispatchEvent(new UpdateShowTitleEvent(event.selected));

const showSubtitleClicked = (page:HbDocPage) => (event:SwitchChangeEvent) => 
    page.$hbDocData.dispatchEvent(new UpdateShowSubtitleEvent(event.selected));


const renderEditThumbnailTabContent = (page:HbDocPage, state:IDocDataState) => {
    return html`
        <div class="edit-tab-content">
            <pre style="margin:0;">
                Set thumb
                Thumb description
                Image
                Use subtitle as thumb description</pre>
        </div>
    `;
};

const renderEditAuthorTabContent = (page:HbDocPage, state:IDocDataState) => {
    return html`
        <div class="edit-tab-content">
            <pre style="margin:0">
                Author Avatar
                Author Name
                Author Email
                Author Last Login</pre>
        </div>
    `;
};


const clickEditTab = (page:HbDocPage, tab:string) => (event:Event) => {
    const nextTab = page.selectedEditTab === tab ? "" : tab;
    page.selectedEditTab = nextTab;
};


declare global {
  interface HTMLElementTagNameMap {
    'hb-doc-page': HbDocPage
  }
}
