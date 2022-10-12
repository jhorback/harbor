var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../styles";
import { DeleteDocumentEvent, DocumentDeletedEvent } from "./data/hb-delete-document-data";
import "./data/hb-delete-document-data";
/**
 * @fires {@link DocumentDeletedEvent}
 */
let DeleteDocumentDialog = class DeleteDocumentDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.uid = "";
    }
    render() {
        return html `
            <hb-delete-document-data
                @document-deleted=${this.documentDeleted}
            ></hb-add-document-data>
            <dialog>
                <div class="contents">
                    <div class="center">
                        <span class="material-symbols-outlined">
                            delete_forever
                        </span>
                    </div>

                    <h1 class="headline-small center">Delete document</h1>

                    <div class="body-medium">
                        Deleting a document may cause other documents to have broken links.
                        There is no recovery for this destructive action.
                    </div>
                    
                    <div class="dialog-buttons">
                        <hb-button
                            text-button
                            label="Cancel"
                            @click=${this.close}
                        ></hb-button>
                        <hb-button
                            text-button
                            label="Delete"
                            @click=${this.deleteButtonClicked}
                        ></hb-button>
                    </div> 
                </div>               
            </dialog>
        `;
    }
    updated() {
        this.open && !this.$dialog.open && this.$dialog.showModal();
        !this.open && this.$dialog.close();
    }
    close() {
        this.open = false;
    }
    deleteButtonClicked() {
        this.shadowRoot?.dispatchEvent(new DeleteDocumentEvent(this.uid));
    }
    documentDeleted(event) {
        event.stopImmediatePropagation();
        this.dispatchEvent(new DocumentDeletedEvent());
        this.close();
    }
    static { this.styles = [styles.types, styles.dialog, styles.icons, css `
        :host {
            display: block;
            z-index:1;
        }
        .contents {
            display: flex;
            flex-direction: column;
            max-width: 264px;
            gap: 10px;
        }
        .center {
            text-align: center;
        }
  `]; }
};
__decorate([
    property({ type: Boolean })
], DeleteDocumentDialog.prototype, "open", void 0);
__decorate([
    property({ type: String })
], DeleteDocumentDialog.prototype, "uid", void 0);
__decorate([
    query("dialog")
], DeleteDocumentDialog.prototype, "$dialog", void 0);
DeleteDocumentDialog = __decorate([
    customElement('hb-delete-document-dialog')
], DeleteDocumentDialog);
export { DeleteDocumentDialog };
