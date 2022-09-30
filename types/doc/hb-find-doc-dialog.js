var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import "./data/hb-search-docs-data";
import "../common/hb-button";
import "../common/hb-list-item";
import { linkProp } from "@domx/linkprop";
import { SearchDocsData, SearchDocsEvent } from "./data/hb-search-docs-data";
export class DocumentSelectedEvent extends Event {
    constructor(documentReference) {
        super(DocumentSelectedEvent.eventType);
        this.documentReference = documentReference;
    }
}
DocumentSelectedEvent.eventType = "document-selected";
/**
 * @fires {@link DocumentSelectedEvent}
 */
let FindDocDialog = class FindDocDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.state = SearchDocsData.defaultState;
        this.selectedIndex = null;
        this.searchText = "";
    }
    reset() {
        this.searchText = "";
        this.selectedIndex = null;
        this.$searchText.value = "";
    }
    render() {
        const selectButtonEnabled = this.selectedIndex !== null
            && this.state.list[this.selectedIndex];
        return html `
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
                    ${this.state.list
            .map(docModel => docModel.toListItem())
            .map((listItem, index) => html `
                        <hb-list-item
                            icon=${listItem.icon}
                            text=${listItem.text}
                            description=${listItem.description}
                            ?selected=${this.isSelected(index)}                                    
                            @hb-list-item-click=${() => this.selectedIndex = index}
                        ></hb-list-item>
                    `)}
                </div>

                <div class="buttons">
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
        `;
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
    isSelected(index) {
        return index === this.selectedIndex;
    }
    textKeyUp(event) {
        this.searchText = event.target.value;
        this.$dataEl.dispatchEvent(new SearchDocsEvent({
            text: this.searchText
        }));
    }
    selectButtonClicked() {
        if (this.selectedIndex === null) {
            return;
        }
        this.dispatchEvent(new DocumentSelectedEvent(this.state.list[this.selectedIndex].toDocumentReference()));
        this.close();
    }
};
FindDocDialog.styles = [styles.types, styles.icons, styles.colors, css `
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
            
            padding: 24px 24px 12px 24px;
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
  `];
__decorate([
    property({ type: Boolean })
], FindDocDialog.prototype, "open", void 0);
__decorate([
    query("dialog")
], FindDocDialog.prototype, "$dialog", void 0);
__decorate([
    query("#searchText")
], FindDocDialog.prototype, "$searchText", void 0);
__decorate([
    query("hb-search-docs-data")
], FindDocDialog.prototype, "$dataEl", void 0);
__decorate([
    property({ type: Object })
], FindDocDialog.prototype, "state", void 0);
__decorate([
    state()
], FindDocDialog.prototype, "selectedIndex", void 0);
FindDocDialog = __decorate([
    customElement('hb-find-doc-dialog')
], FindDocDialog);
export { FindDocDialog };
