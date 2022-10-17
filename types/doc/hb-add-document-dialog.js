var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import { AddDocumentData, AddNewDocumentEvent, DocumentAddedEvent } from "./data/hb-add-document-data";
import "./data/hb-add-document-data";
import "../common/hb-button";
import "../common/hb-list-item";
import "../common/hb-text-input";
import { linkProp } from "@domx/linkprop";
/**
 * @fires {@link DocumentAddedEvent}
 */
let AddDocumentDialog = class AddDocumentDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.state = AddDocumentData.defaultState;
        this.selectedIndex = 0;
        this.addButtonEnabled = false;
        this.addDocumentError = null;
        this.newDocTitle = "";
    }
    reset() {
        this.addButtonEnabled = false;
        this.newDocTitle = "";
        this.selectedIndex = 0;
        this.addDocumentError = "";
    }
    render() {
        return html `
            <hb-add-document-data
                @state-changed=${linkProp(this, "state")}
                @document-added=${this.documentAdded}
                @add-document-error=${this.handleAddDocumentError}
            ></hb-add-document-data>
            <dialog>
                
                <h1 class="headline-small">Add New Document</h1>

                <div class="field">            
                    <div class="label-large">Document type</div>
                    <div class="list">
                        ${this.state.docTypes.map((docType, index) => html `
                            <hb-list-item
                                icon=${docType.icon}
                                text=${docType.name}
                                description=${docType.description}
                                ?selected=${this.isSelected(index)}                                    
                                @hb-list-item-click=${() => this.selectedIndex = index}
                            ></hb-list-item>
                        `)}
                    </div>
                </div>
                <hr>
                <div class="field">
                    <div class="label-large">Document name</div>
                    <hb-text-input
                        placeholder="Enter the document title"
                        value=${this.newDocTitle}
                        error-text=${this.addDocumentError}
                        @hb-text-input-change=${this.textInputChange}
                    ></hb-text-input>
                </div>
                <div class="dialog-buttons">
                    <hb-button
                        text-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
                        text-button
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
    close() {
        this.reset();
        this.open = false;
    }
    isSelected(index) {
        return index === this.selectedIndex;
    }
    textInputChange(event) {
        this.newDocTitle = event.value;
        this.addButtonEnabled = this.newDocTitle.length > 2;
        this.addDocumentError = null;
        if (this.addButtonEnabled && event.enterKey) {
            this.addButtonClicked();
        }
    }
    addButtonClicked() {
        this.shadowRoot?.dispatchEvent(new AddNewDocumentEvent({
            docType: this.state.docTypes[this.selectedIndex].type,
            title: this.newDocTitle
        }));
    }
    handleAddDocumentError(event) {
        this.addDocumentError = event.error.message;
    }
    documentAdded(event) {
        event.stopImmediatePropagation();
        this.dispatchEvent(new DocumentAddedEvent(event.docModel));
        this.close();
    }
    static { this.styles = [styles.types, styles.dialog, css `
        :host {
            display: block;
            z-index:1;
        }

        .field {
            margin: 1rem 0;
            padding: 1rem 0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .list {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
  `]; }
};
__decorate([
    property({ type: Boolean })
], AddDocumentDialog.prototype, "open", void 0);
__decorate([
    query("dialog")
], AddDocumentDialog.prototype, "$dialog", void 0);
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
__decorate([
    state()
], AddDocumentDialog.prototype, "addDocumentError", void 0);
AddDocumentDialog = __decorate([
    customElement('hb-add-document-dialog')
], AddDocumentDialog);
export { AddDocumentDialog };
