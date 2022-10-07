import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "../styles";
import { docTypes } from "../domain/Doc/docTypes";
import { DocData, IDocDataState } from "./data/hb-doc-data";
import { linkProp } from "@domx/dataelement";
import "../layout/hb-page-layout";
import "../common/hb-button";

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
    inEditMode = false;

    @state()
    selectedSettingsTab:string = "settings";

    render() {
        return html`
            <hb-doc-data
                uid=${this.uid}
                @state-changed=${linkProp(this, "state")}
            ></hb-doc-data>     
            <hb-page-layout>
                ${renderAppBarButtons(this, this.state)}
                ${this.inEditMode ? renderEditTabs(this, this.state) : html``}
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
        this.inEditMode = false;
    }

    static styles = [styles.types, styles.icons, css`
        :host {
            display: block;
        }
        [hidden] {
            display: none;
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
    <div>EDIT TABS</div>
`;

declare global {
  interface HTMLElementTagNameMap {
    'hb-doc-page': HbDocPage
  }
}
