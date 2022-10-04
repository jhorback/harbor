import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import  "./data/hb-search-docs-data";
import "../common/hb-button";
import "../common/hb-list-item";
import "../common/hb-text-input";
import { TextInputChangeEvent } from "../common/hb-text-input";
import { linkProp } from "@domx/linkprop";
import { IDocumentReference } from "../domain/interfaces/DocumentInterfaces";
import { SearchDocsData, SearchDocsEvent } from "./data/hb-search-docs-data";


export class DocumentSelectedEvent extends Event {
    static eventType = "document-selected";
    documentReference:IDocumentReference;
    constructor(documentReference:IDocumentReference) {
        super(DocumentSelectedEvent.eventType);
        this.documentReference = documentReference;
    }
}


/**  
 * @fires {@link DocumentSelectedEvent}
 */
@customElement('hb-find-doc-dialog')
export class FindDocDialog extends LitElement {

    @property({type:Boolean})
    open = false;

    @query("dialog")
    $dialog!:HTMLDialogElement;

    @query("hb-search-docs-data")
    $dataEl!:SearchDocsData;

    @property({type: Object})
    state = SearchDocsData.defaultState;

    @state()
    selectedIndex:number|null = null;

    searchText = "";

    private reset() {
        this.searchText = "";
        this.selectedIndex = null;
    }

    render() {
        const selectButtonEnabled = this.selectedIndex !== null
            && this.state.list[this.selectedIndex];


        return html`
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            <dialog>
                
                <h1 class="headline-small">Find Document</h1>

                    <hb-text-input
                        autofocus
                        placeholder="Enter search text"
                        value=${this.searchText}
                        @hb-text-input-change=${this.textInputChange}
                    ></hb-text-input>

                <div class="list" ?hidden=${this.state.list.length === 0}>                    
                    ${this.state.list
                        .map(docModel => docModel.toListItem())
                        .map((listItem, index) => html`
                        <hb-list-item
                            icon=${listItem.icon}
                            text=${listItem.text}
                            description=${listItem.description}
                            ?selected=${this.isSelected(index)}                                    
                            @hb-list-item-click=${() => this.selectedIndex = index}
                        ></hb-list-item>
                    `)}
                </div>

                <hr ?hidden=${this.state.list.length === 0}>

                <div class="dialog-buttons">
                    <hb-button
                        text-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
                        text-button
                        label="Select Document"
                        ?disabled=${this.iSelectButtonDisabled()}
                        @click=${this.selectButtonClicked}
                    ></hb-button>
                </div>                
            </dialog>
        `
    }

    updated() {
        this.open && !this.$dialog.open && this.$dialog.showModal();
        !this.open && this.$dialog.close();
    }

    iSelectButtonDisabled() {
       return this.selectedIndex === null
            || this.state.list[this.selectedIndex] === undefined;
    }

    close() {
        this.reset();
        this.open = false;
    }

    private isSelected(index:number) {
        return index === this.selectedIndex;
    }

    private textInputChange(event:TextInputChangeEvent) {
        this.searchText = event.value;
        this.$dataEl.dispatchEvent(new SearchDocsEvent({
            text: this.searchText
        }));
    }

    private selectButtonClicked() {
        if (this.selectedIndex === null) {
            return;
        }

        this.dispatchEvent(new DocumentSelectedEvent(this.state.list[this.selectedIndex].toDocumentReference()));
        this.close();
    }
    


    static styles = [styles.types, styles.dialog, css`
        :host {
            display: block;
            z-index:1;
        }
       
        .field {
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
    'hb-find-doc-dialog': FindDocDialog
  }
}
