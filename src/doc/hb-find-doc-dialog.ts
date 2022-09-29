import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { classMap } from 'lit/directives/class-map.js';
import { styles } from "../styles";
import  "./data/hb-search-docs-data";
import "../common/hb-button";
import "../common/hb-list-item";
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

    @query("#searchText")
    $searchText!:HTMLInputElement;

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
        this.$searchText.value = "";
    }

    render() {
        const selectButtonEnabled = this.selectedIndex !== null
            && this.state.list[this.selectedIndex];


        return html`
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            <dialog class="dark-theme">
                
                <h1 class="headline-small">Find Document</h1>

                <div class="field">
                    <div class="text-input-container">
                        <input id="searchText"
                            type="text"
                            class="text-input"
                            autofocus
                            placeholder="Enter search text"
                            value=${this.searchText}
                            @keyup=${this.textKeyUp}>
                    </div>
                </div>

                <div class="list">
                    
                    ${
                        this.state.list.map((docModel, index) => {
                            const listItem = docModel.toListItem();
                            return html`
                                <hb-list-item
                                    icon=${listItem.icon}
                                    text=${listItem.text}
                                    description=${listItem.description}
                                    ?selected=${this.isSelected(index)}                                    
                                    @hb-list-item-click=${() => this.selectedIndex = index}
                                ></hb-list-item>
                        `})
                    }
                </div>

                <div class="buttons">
                    <hb-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
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

    private textKeyUp(event:KeyboardEvent) {
        this.searchText = (event.target as HTMLInputElement).value;
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
    


    static styles = [styles.types, styles.icons, styles.colors, css`
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

        .buttons {
            margin-top: 1rem;
            display: flex;
            gap: 1rem;
            justify-content: right;
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
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-find-doc-dialog': FindDocDialog
  }
}
