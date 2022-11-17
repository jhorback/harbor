import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../styles";
import { DeletePageController, DeletePageEvent, PageDeletedEvent } from "./DeletePageController";



/**  
 * @fires {@link PageDeletedEvent}
 */
@customElement('hb-delete-page-dialog')
export class DeletePageDialog extends LitElement {

    deletePage:DeletePageController = new DeletePageController(this);

    @property({type:String})
    uid = "";

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

                    <h1 class="headline-small center">Delete Page</h1>

                    <div class="body-medium">
                        Deleting a page may cause other pages to have broken links.
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
        this.dispatchEvent(new DeletePageEvent(this.uid));
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
    'hb-delete-page-dialog': DeletePageDialog
  }
}
