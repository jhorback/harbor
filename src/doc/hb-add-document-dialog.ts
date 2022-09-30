import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from 'lit/directives/class-map.js';
import { styles } from "../styles";
import { AddDocumentData, AddNewDocumentEvent, DocumentAddedEvent } from "./data/hb-add-document-data";
import  "./data/hb-add-document-data";
import "../common/hb-button";
import "../common/hb-list-item";
import { linkProp } from "@domx/linkprop";
import { IDocumentReference } from "../domain/interfaces/DocumentInterfaces";
import { ClientError } from "../domain/ClientError";


/**  
 * @fires {@link DocumentAddedEvent}
 */
@customElement('hb-add-document-dialog')
export class AddDocumentDialog extends LitElement {

    @property({type:Boolean})
    open = false;

    @query("dialog")
    $dialog!:HTMLDialogElement;

    @query("#newDocumentTitle")
    $newDocumentTitle!:HTMLInputElement;

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
        this.$newDocumentTitle.value = "";
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
                    <div class=${classMap({"text-input-container":true, "property-error": this.addDocumentError ? true : false})}>
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

    private textKeyUp(event:KeyboardEvent) {
        this.newDocTitle = (event.target as HTMLInputElement).value;
        this.addButtonEnabled = this.newDocTitle.length > 2;
        this.addDocumentError = null;
        if (this.addButtonEnabled && event.key === "Enter") {
            this.addButtonClicked();
        }
    }

    private addButtonClicked() {
        this.shadowRoot?.dispatchEvent(new AddNewDocumentEvent({
            docType: this.state.docTypes[this.selectedIndex].type,
            title: this.newDocTitle
        }));
    }

    private handleAddDocumentError(event:CustomEvent) {
        const error = event.detail as ClientError;
        this.addDocumentError = error.message;     
    }
    
    // FIXME: after stateChange CustomEvent -> Event
    // should just be able to re-dispatch?
    private documentAdded(event:CustomEvent) {  
        const docRef = event.detail as IDocumentReference;
        this.dispatchEvent(new DocumentAddedEvent(docRef));
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
            outline: 0;
            border: 1px solid var(--md-sys-color-on-background);
            color: var(--md-sys-color-on-background);
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
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-add-document-dialog': AddDocumentDialog
  }
}
