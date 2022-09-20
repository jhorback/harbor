import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../styles";
import "../common/hb-button";


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
 *  - state.results: Array<IDocumentThumbnail>
 *  - state.count
 *  - state.searchText
 *  - handles-event.search-text-changed
 *  - fires-event.document-selected
 *  - db.searchDocuments
 */
@customElement('hb-add-document-dialog')
export class AddDocumentDialog extends LitElement {

    @property({type:Boolean})
    open = false;

    @query("dialog")
    $dialog!:HTMLDialogElement;

    render() {
        return html`
            <dialog class="dark-theme">
                
                <h1 class="headline-small">Add New Document</h1>

                <div>
                    Testing
                </div>

                <hb-button label="Close" @click=${this.closeButtonClicked}></hb-button>
                
            </dialog>
        `
    }

    updated() {
        this.open && this.$dialog.showModal();
        !this.open && this.$dialog.close();
    }

    private closeButtonClicked() {
        this.open = false;
    }

    static styles = [styles.page, styles.types, styles.colors, css`
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
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-add-document-dialog': AddDocumentDialog
  }
}
