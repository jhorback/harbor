import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from 'lit/directives/class-map.js';
import { styles } from "../styles";
import { AddDocumentData } from "./data/hb-add-document-data";
import  "./data/hb-add-document-data";
import "../common/hb-button";
import { linkProp } from "@domx/linkprop";
import { IDocumentReference } from "../domain/interfaces/DocumentInterfaces";
import { ClientError } from "../domain/ClientError";


/** 
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
@customElement('hb-add-document-dialog')
export class AddDocumentDialog extends LitElement {

    @property({type:Boolean})
    open = false;

    @query("dialog")
    $dialog!:HTMLDialogElement;

    @query("#newDocumentTitle")
    $newDocumentTitle!:HTMLInputElement;

    @query("hb-add-document-data")
    $dataEl!:AddDocumentData;

    @property({type: Object})
    state = AddDocumentData.defaultState;

    @state()
    selectedIndex = 0;

    @state()
    addButtonEnabled = false;

    @state()
    addDocumentError:string|null = null;

    newDocTitle = "";

    private reset() {
        this.addButtonEnabled = false;
        this.newDocTitle = "";
        this.selectedIndex = 0;
        this.$newDocumentTitle.value = "";
        this.addDocumentError = "";
    }

    render() {
        return html`
            <hb-add-document-data
                @state-changed=${linkProp(this, "state")}
                @document-added=${this.documentAdded}
                @add-document-error=${this.handleAddDocumentError}
            ></hb-add-document-data>
            <dialog class="dark-theme">
                
                <h1 class="headline-small">Add New Document</h1>

                <div class="field">            
                    <div class="label-large">Document type</div>

                    ${this.state.docTypes.map((docType, index) => html`
                        <div
                            class=${classMap({"doc-type": true, "selected": this.isSelected(index)})}
                            @click=${() => this.selectedIndex = index}>
                            <div>
                                <div class="icon icon-small">${docType.icon}</div>
                            </div>
                            <div class="text">
                                <div class="body-large">${docType.name}</div>
                                <div class="label-small">${docType.description}</div>
                            </div>
                            <div>
                                <div class="icon icon-small">
                                    ${this.isSelected(index) ? html`radio_button_checked` : html`radio_button_unchecked`}
                                </div>
                            </div>
                        </div>
                    `)}
                </div>
                <div class="field">
                    <div class="label-large">Document name</div>
                    <div class=${classMap({"text-input-container":true, "property-error": this.addDocumentError ? true : false})}>
                        <input id="newDocumentTitle"
                            type="text"
                            class="text-input"
                            placeholder="Enter the document title"
                            @keyup=${this.textKeyUp}>
                        <div class="error-text body-small">
                            ${this.addDocumentError}
                        </div>
                    </div>
                </div>
                <div class="buttons">
                    <hb-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
                        label="Add Document"
                        ?disabled=${!this.addButtonEnabled}
                        @click=${this.addButtonClicked}
                    ></hb-button>
                </div>                
            </dialog>
        `
    }

    updated() {
        this.open && !this.$dialog.open && this.$dialog.showModal();
        !this.open && this.$dialog.close();
    }

    close () {
        this.reset();
        this.open = false;
    }

    private isSelected(index:number) {
        return index === this.selectedIndex;
    }

    private textKeyUp(event:KeyboardEvent) {
        this.newDocTitle = (event.target as HTMLInputElement).value;
        this.addButtonEnabled = this.newDocTitle.length > 2;
        this.addDocumentError = null;
        if (this.addButtonEnabled && event.key === "Enter") {
            this.addButtonClicked();
        }
    }

    private addButtonClicked() {
        this.shadowRoot?.dispatchEvent(AddDocumentData.addNewDocumentEvent({
            docType: this.state.docTypes[this.selectedIndex].type,
            title: this.newDocTitle
        }));
    }

    private handleAddDocumentError(event:CustomEvent) {
        const error = event.detail as ClientError;
        this.addDocumentError = error.message;     
    }
    
    private documentAdded(event:CustomEvent) {
        const docRef = event.detail as IDocumentReference;
        this.dispatchEvent(new CustomEvent("document-added", {detail:docRef}));
        this.close();
    }

    static styles = [styles.types, styles.icons, styles.colors, css`
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


        /*
        jch: hb-text-input control?
        */
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
            background: transparent;
        }
        .property-error .text-input {
            border-color: var(--md-sys-color-error);
        }
        .property-error .text-input:focus {
            border-color: var(--md-sys-color-error) !important;
            outline: none;
        }
        .error-text {
            padding-left: 1rem;
            padding-top: 4px;
            height: 16px;
        }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-add-document-dialog': AddDocumentDialog
  }
}
