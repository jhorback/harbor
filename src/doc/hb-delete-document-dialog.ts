import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../styles";
import { DeleteDocumentData, DeleteDocumentEvent, DocumentDeletedEvent } from "./data/hb-delete-document-data";
import  "./data/hb-delete-document-data";


/**  
 * @fires {@link DocumentDeletedEvent}
 */
@customElement('hb-delete-document-dialog')
export class DeleteDocumentDialog extends LitElement {

    @property({type:Boolean})
    open = false;

    @property({type:String})
    uid = "";

    @query("dialog")
    $dialog!:HTMLDialogElement;

    render() {
        return html`
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
        `
    }

    updated() {
        this.open && !this.$dialog.open && this.$dialog.showModal();
        !this.open && this.$dialog.close();
    }

    close () {
        this.open = false;
    }

    private deleteButtonClicked() {
        this.shadowRoot?.dispatchEvent(new DeleteDocumentEvent(this.uid));
    }
    
    private documentDeleted(event:DocumentDeletedEvent) {  
        event.stopImmediatePropagation();
        this.dispatchEvent(new DocumentDeletedEvent());
        this.close();
    }

    static styles = [styles.types, styles.dialog, styles.icons, css`
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
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-delete-document-dialog': DeleteDocumentDialog
  }
}
