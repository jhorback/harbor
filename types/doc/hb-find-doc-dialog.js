var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { linkProp } from "@domx/linkprop";
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { debounce } from "../common/debounce";
import "../common/hb-button";
import "../common/hb-list-item";
import "../common/hb-text-input";
import { styles } from "../styles";
import "./data/hb-search-docs-data";
import { SearchDocsData, SearchDocsEvent } from "./data/hb-search-docs-data";
export class DocumentSelectedEvent extends Event {
    constructor(docModel) {
        super(DocumentSelectedEvent.eventType);
        this.docModel = docModel;
        this.documentReference = docModel.toDocumentReference();
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
    }
    render() {
        const selectButtonEnabled = this.selectedIndex !== null
            && this.state.list[this.selectedIndex];
        return html `
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            <dialog @cancel=${this.close}>
                
                <h1 class="headline-small">Find Page</h1>

                    <hb-text-input
                        autofocus
                        placeholder="Enter search text"
                        value=${this.searchText}
                        error-text=${this.hasNoResults() ? "There were no pages found" : ""}
                        @hb-text-input-change=${debounce(this.textInputChange)}
                    ></hb-text-input>

                <div class="list" ?hidden=${this.state.list.length === 0}>                    
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

                <hr ?hidden=${this.state.list.length === 0}>

                <div class="dialog-buttons">
                    <hb-button
                        text-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
                        text-button
                        label="Select Page"
                        ?disabled=${this.iSelectButtonDisabled()}
                        @click=${this.selectButtonClicked}
                    ></hb-button>
                </div>                
            </dialog>
        `;
    }
    hasNoResults() {
        return this.searchText.length > 0 && this.state.isLoading === false && this.state.count === 0;
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
        this.dispatchEvent(new Event("cancel"));
    }
    isSelected(index) {
        return index === this.selectedIndex;
    }
    textInputChange(event) {
        this.searchText = event.value;
        this.$dataEl.dispatchEvent(new SearchDocsEvent({
            text: this.searchText
        }));
    }
    selectButtonClicked() {
        if (this.selectedIndex === null) {
            return;
        }
        this.dispatchEvent(new DocumentSelectedEvent(this.state.list[this.selectedIndex]));
        this.close();
    }
};
FindDocDialog.styles = [styles.types, styles.dialog, css `
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
  `];
__decorate([
    property({ type: Boolean })
], FindDocDialog.prototype, "open", void 0);
__decorate([
    query("dialog")
], FindDocDialog.prototype, "$dialog", void 0);
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
