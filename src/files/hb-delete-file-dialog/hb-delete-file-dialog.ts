import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../styles";
import { DeleteFileController, DeleteFileEvent, FileDeletedEvent } from "./DeleteFileController";



/**  
 * @fires {@link FileDeletedEvent}
 */
@customElement('hb-delete-file-dialog')
export class DeleteFileDialog extends LitElement {

    deleteFile:DeleteFileController = new DeleteFileController(this);

    @property({type:String, attribute: "file-name"})
    fileName = "";

    @query("dialog")
    $dialog!:HTMLDialogElement;

    render() {
        return html`
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

    close () {
        this.$dialog.close();
    }

    private deleteButtonClicked() {
        this.dispatchEvent(new DeleteFileEvent(this.fileName));
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
    'hb-delete-file-dialog': DeleteFileDialog
  }
}
