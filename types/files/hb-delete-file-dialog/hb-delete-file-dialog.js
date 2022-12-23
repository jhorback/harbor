var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../styles";
import { DeleteFileController, DeleteFileEvent } from "./DeleteFileController";
/**
 * @fires {@link FileDeletedEvent}
 */
let DeleteFileDialog = class DeleteFileDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.deleteFile = new DeleteFileController(this);
        this.fileName = "";
    }
    render() {
        return html `
            <dialog @cancel=${this.close}>
                <div class="contents">
                    <div class="center">
                        <span class="material-symbols-outlined">
                            delete_forever
                        </span>
                    </div>

                    <h1 class="headline-small center">Delete File</h1>

                    <div class="body-medium">
                        Deleting a file may cause broken links.                        
                    </div>
                    <div class="body-medium">
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
    showModal() {
        this.$dialog.showModal();
    }
    close() {
        this.$dialog.close();
    }
    deleteButtonClicked() {
        this.dispatchEvent(new DeleteFileEvent(this.fileName));
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
    property({ type: String, attribute: "file-name" })
], DeleteFileDialog.prototype, "fileName", void 0);
__decorate([
    query("dialog")
], DeleteFileDialog.prototype, "$dialog", void 0);
DeleteFileDialog = __decorate([
    customElement('hb-delete-file-dialog')
], DeleteFileDialog);
export { DeleteFileDialog };
