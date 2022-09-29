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
import { AddDocumentData, AddNewDocumentEvent, DocumentAddedEvent } from "./data/hb-add-document-data";
import "./data/hb-add-document-data";
import "../common/hb-button";
import "../common/hb-list-item";
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
        this.$newDocumentTitle.value = "";
        this.addDocumentError = "";
    }
    render() {
        return html `
            <hb-add-document-data
                @state-changed=${linkProp(this, "state")}
                @document-added=${this.documentAdded}
                @add-document-error=${this.handleAddDocumentError}
            ></hb-add-document-data>
            <dialog class="dark-theme">
                
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
                <div class="field">
                    <div class="label-large">Document name</div>
                    <div class=${classMap({ "text-input-container": true, "property-error": this.addDocumentError ? true : false })}>
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
        this.newDocTitle = event.target.value;
        this.addButtonEnabled = this.newDocTitle.length > 2;
        this.addDocumentError = null;
        if (this.addButtonEnabled && event.key === "Enter") {
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
        const error = event.detail;
        this.addDocumentError = error.message;
    }
    // FIXME: after stateChange CustomEvent -> Event
    // should just be able to re-dispatch?
    documentAdded(event) {
        const docRef = event.detail;
        this.dispatchEvent(new DocumentAddedEvent(docRef));
        this.close();
    }
};
AddDocumentDialog.styles = [styles.types, styles.icons, styles.colors, css `
        :host {
            display: block;
            z-index:1;
        }

        
        /*
        jch: .dialog styles
        */
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

        
        .buttons {
            display: flex;
            gap: 1rem;
            justify-content: right;
        }

        .list {
            display: flex;
            flex-direction: column;
            gap: 5px;
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
__decorate([
    state()
], AddDocumentDialog.prototype, "addDocumentError", void 0);
AddDocumentDialog = __decorate([
    customElement('hb-add-document-dialog')
], AddDocumentDialog);
export { AddDocumentDialog };
