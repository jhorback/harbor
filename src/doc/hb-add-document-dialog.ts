import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import { AddDocumentData, AddDocumentErrorEvent, AddNewDocumentEvent, DocumentAddedEvent } from "./data/hb-add-document-data";
import  "./data/hb-add-document-data";
import "../common/hb-button";
import "../common/hb-list-item";
import "../common/hb-text-input";
import { TextInputChangeEvent } from "../common/hb-text-input";
import { linkProp } from "@domx/linkprop";
import { IDocumentReference } from "../domain/interfaces/DocumentInterfaces";
import { ClientError } from "../domain/Errors";


/**  
 * @fires {@link DocumentAddedEvent}
 */
@customElement('hb-add-document-dialog')
export class AddDocumentDialog extends LitElement {

    @property({type:Boolean})
    open = false;

    @query("dialog")
    $dialog!:HTMLDialogElement;

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
        this.addDocumentError = "";
    }

    render() {
        return html`
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
                        ${this.state.docTypes.map((docType, index) => html`
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

    private textInputChange(event:TextInputChangeEvent) {
        this.newDocTitle = event.value;
        this.addButtonEnabled = this.newDocTitle.length > 2;
        this.addDocumentError = null;
        if (this.addButtonEnabled && event.enterKey) {
            this.addButtonClicked();
        }
    }

    private addButtonClicked() {
        this.shadowRoot?.dispatchEvent(new AddNewDocumentEvent({
            docType: this.state.docTypes[this.selectedIndex].type,
            title: this.newDocTitle
        }));
    }

    private handleAddDocumentError(event:AddDocumentErrorEvent) {
        this.addDocumentError = event.error.message;     
    }
    
    private documentAdded(event:DocumentAddedEvent) {  
        event.stopImmediatePropagation();
        this.dispatchEvent(new DocumentAddedEvent(event.docModel));
        this.close();
    }

    static styles = [styles.types, styles.dialog, css`
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
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-add-document-dialog': AddDocumentDialog
  }
}
