var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from 'lit/directives/class-map.js';
import { styles } from "../styles";
import { AddDocumentData } from "./data/hb-add-document-data";
import "./data/hb-add-document-data";
import "../common/hb-button";
import { linkProp } from "@domx/linkprop";
/**
 * // todo: add doc data element
 * // will need a data element to list out all document types
 * // then take the doc type and doc name and add to db
 * // when done this dialog would need to fire an event on itself that contains the information
 * // to be able to set that as the home page - the documentReference?
 *
 * hb-add-document-data
 *  - state.docTypes []
 *  - fires-event.document-added
 *  - db.addDocument
 *
 * hb-search-documents-data
 *  - documents.results: Array<IDocumentThumbnail>
 *  - documents.count
 *  - documents.searchText
 *  - handles-event.search-text-changed
 *  - fires-event.document-selected
 *  - db.searchDocuments
 *
 * // jch: new controls for dialog and text input?
 * and maybe selection list?
 */
let AddDocumentDialog = class AddDocumentDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.state = AddDocumentData.defaultState;
        this.selectedIndex = 0;
        this.addButtonEnabled = false;
        this.newDocTitle = "";
    }
    reset() {
        this.addButtonEnabled = false;
        this.newDocTitle = "";
        this.selectedIndex = 0;
        this.$newDocumentTitle.value = "";
    }
    render() {
        return html `
            <hb-add-document-data
                @state-changed=${linkProp(this, "state")}
                @document-added=${this.documentAdded}
            ></hb-add-document-data>
            <dialog class="dark-theme">
                
                <h1 class="headline-small">Add New Document</h1>

                <div class="field">            
                    <div class="label-large">Document type</div>

                    ${this.state.docTypes.map((docType, index) => html `
                        <div
                            class=${classMap({ "doc-type": true, "selected": this.isSelected(index) })}
                            @click=${() => this.selectedIndex = index}
                        >

                            <div>
                                <div class="icon icon-small">${docType.icon}</div>
                            </div>
                            <div class="text">
                                <div class="body-large">${docType.name}</div>
                                <div class="label-small">${docType.description}</div>
                            </div>
                            <div>
                                <div class="icon icon-small">
                                    ${this.isSelected(index) ? html `radio_button_checked` : html `radio_button_unchecked`}
                                </div>
                            </div>
                        </div>
                    `)}
                </div>
                <div class="field">
                    <div class="label-large">Document name</div>
                    <div class="text-input-container">
                        <input id="newDocumentTitle"
                            type="text"
                            class="text-input"
                            placeholder="Enter the document title"
                            @keyup=${this.textKeyUp}>
                    </div>
                </div>
                <div class="buttons">
                    <hb-button
                        label="Cancel"
                        @click=${this.cancelButtonClicked}
                    ></hb-button>
                    <hb-button
                        label="Add Document"
                        ?disabled=${!this.addButtonEnabled}
                        @click=${this.addButtonClicked}
                    ></hb-button>
                </div>                
            </dialog>
        `;
    }
    updated() {
        this.open && !this.$dialog.open && this.$dialog.showModal();
        !this.open && this.$dialog.close();
    }
    isSelected(index) {
        return index === this.selectedIndex;
    }
    textKeyUp(event) {
        this.newDocTitle = event.target.value;
        this.addButtonEnabled = this.newDocTitle.length > 2;
    }
    cancelButtonClicked() {
        this.reset();
        this.open = false;
    }
    addButtonClicked() {
        this.shadowRoot?.dispatchEvent(AddDocumentData.addNewDocumentEvent({
            docType: this.state.docTypes[this.selectedIndex].type,
            title: this.newDocTitle
        }));
    }
    documentAdded(event) {
        //const docRef = event.detail as IDocumentReference;
        const docRef = event.detail;
        alert(docRef.foo);
    }
};
AddDocumentDialog.styles = [styles.types, styles.icons, css `
        :host {
            display: block;
            z-index:1;
        }
        dialog {
            z-index:1;
            border: none !important;
            border-radius: var(--md-sys-shape-corner-extra-large);
            background-color: var(--md-sys-color-surface-variant);
            
            box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            
            padding: 24px;
            min-width: 300px;
            max-width: 534px;
        }
        dialog::backdrop {
            background-color: rgb(0, 0, 0, 0.4)
        }
        .field {
            margin: 1rem 0;
            padding: 1rem 0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .doc-type {
            user-select: none;
            border: 1px solid transparent;
            border-radius:  var(--md-sys-shape-corner-medium);
            padding: 0.5rem 0 0.5rem 0;
            display: flex;
            align-items: center;
            justify-content: top;
            cursor: default;
            gap: 0.5rem;
        }
        .doc-type:hover {
            border: 1px solid;
        }
        .doc-type.selected {
            border: 1px solid;
        }
        .doc-type .text {
            max-width: 25ch;
        }
        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: right;
        }
        .text-input-container {
            padding-right: 2rem;
        }
        .text-input {
            font-weight: var(--md-sys-typescale-body-large-font-weight);
            font-size: var(--md-sys-typescale-body-large-font-size);
            border-radius:  var(--md-sys-shape-corner-extra-small);
            border: 1px solid;
            line-height: 54px;            
            max-width: 100%;
            width: 100%;
            padding: 0 1rem;
        }
  `];
__decorate([
    property({ type: Boolean })
], AddDocumentDialog.prototype, "open", void 0);
__decorate([
    query("dialog")
], AddDocumentDialog.prototype, "$dialog", void 0);
__decorate([
    query("#newDocumentTitle")
], AddDocumentDialog.prototype, "$newDocumentTitle", void 0);
__decorate([
    query("hb-add-document-data")
], AddDocumentDialog.prototype, "$dataEl", void 0);
__decorate([
    property({ type: Object })
], AddDocumentDialog.prototype, "state", void 0);
__decorate([
    state()
], AddDocumentDialog.prototype, "selectedIndex", void 0);
__decorate([
    state()
], AddDocumentDialog.prototype, "addButtonEnabled", void 0);
AddDocumentDialog = __decorate([
    customElement('hb-add-document-dialog')
], AddDocumentDialog);
export { AddDocumentDialog };
