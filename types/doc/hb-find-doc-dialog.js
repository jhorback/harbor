var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import "./data/hb-search-docs-data";
import "../common/hb-button";
import { linkProp } from "@domx/linkprop";
import { SearchDocsData, SearchDocsEvent } from "./data/hb-search-docs-data";
export class DocumentSelectedEvent extends Event {
    constructor(documentReference) {
        super(DocumentSelectedEvent.eventType);
        this.documentReference = documentReference;
    }
}
DocumentSelectedEvent.eventType = "document-selected";
/**
 * hb-search-documents-data
 *  - documents.results: Array<IDocumentThumbnail>
 *  - documents.count
 *  - documents.searchText
 *  - handles-event.search-text-changed
 *  - fires-event.document-selected
 *  - db.searchDocuments
 */
let FindDocDialog = class FindDocDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.state = SearchDocsData.defaultState;
        this.selectedIndex = null;
        this.selectButtonEnabled = false;
        this.searchText = "";
    }
    reset() {
        this.selectButtonEnabled = false;
        this.searchText = "";
        this.selectedIndex = null;
    }
    render() {
        return html `
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            <dialog class="dark-theme">
                
                <h1 class="headline-small">Find Document</h1>

                <div class="field">
                    <div class="text-input-container">
                        <input id="searchText"
                            type="text"
                            class="text-input"
                            placeholder="Enter search text"
                            @keyup=${this.textKeyUp}>
                    </div>
                </div>
                <div class="buttons">
                    <hb-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
                        label="Select Document"
                        ?disabled=${!this.selectButtonEnabled}
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
    close() {
        this.reset();
        this.open = false;
    }
    isSelected(index) {
        return index === this.selectedIndex;
    }
    textKeyUp(event) {
        this.searchText = event.target.value;
        if (this.searchText.length > 2) {
            this.$dataEl.dispatchEvent(new SearchDocsEvent({
                text: this.searchText
            }));
        }
    }
    addButtonClicked() {
        alert("clicked");
    }
};
FindDocDialog.styles = [styles.types, styles.icons, styles.colors, css `
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
  `];
__decorate([
    property({ type: Boolean })
], FindDocDialog.prototype, "open", void 0);
__decorate([
    query("dialog")
], FindDocDialog.prototype, "$dialog", void 0);
__decorate([
    query("hb-search-docs-data")
], FindDocDialog.prototype, "$dataEl", void 0);
__decorate([
    property({ type: Object })
], FindDocDialog.prototype, "state", void 0);
__decorate([
    state()
], FindDocDialog.prototype, "selectedIndex", void 0);
__decorate([
    state()
], FindDocDialog.prototype, "selectButtonEnabled", void 0);
FindDocDialog = __decorate([
    customElement('hb-find-doc-dialog')
], FindDocDialog);
export { FindDocDialog };
