import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { debounce } from "../../common/debounce";
import "../../common/hb-button";
import "../../common/hb-list-item";
import "../../common/hb-text-input";
import { TextInputChangeEvent } from "../../common/hb-text-input";
import { PageModel } from "../../domain/Pages/PageModel";
import { IPageReference } from "../../domain/interfaces/PageInterfaces";
import { styles } from "../../styles";
import { PageSearchController, SearchPagesEvent } from "../PageSearchController";


export class PageSelectedEvent extends Event {
    static eventType = "page-selected";
    pageReference:IPageReference;
    pageModel:PageModel;
    constructor(pageModel:PageModel) {
        super(PageSelectedEvent.eventType);
        this.pageModel = pageModel;
        this.pageReference = pageModel.toPageReference();
    }
}


/**  
 * @fires {@link PageSelectedEvent}
 */
@customElement('hb-find-page-dialog')
export class FindPageDialog extends LitElement {

    pageSearch:PageSearchController = new PageSearchController(this);

    @query("dialog")
    $dialog!:HTMLDialogElement;

    @state()
    selectedIndex:number|null = null;

    searchText = "";

    private reset() {
        this.searchText = "";
        this.selectedIndex = null;
    }

    render() {
        const { state } = this.pageSearch;
        const selectButtonEnabled = this.selectedIndex !== null
            && state.list[this.selectedIndex];


        return html`
            <dialog @cancel=${this.close}>
                
                <h1 class="headline-small">Find Page</h1>

                    <hb-text-input
                        autofocus
                        placeholder="Enter search text"
                        value=${this.searchText}
                        error-text=${this.hasNoResults() ? "There were no pages found" : ""}
                        @hb-text-input-change=${debounce(this.textInputChange)}
                    ></hb-text-input>

                <div class="list" ?hidden=${state.list.length === 0}>                    
                    ${state.list
                        .map(pageModel => pageModel.toListItem())
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

                <hr ?hidden=${state.count === 0}>

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
        const state = this.pageSearch.state;
        return this.searchText.length > 0 && state.isLoading === false && state.count === 0;
    }

    iSelectButtonDisabled() {
       return this.selectedIndex === null
            || this.pageSearch.state.list[this.selectedIndex] === undefined;
    }

    showModal() {
        this.$dialog.showModal();
    }

    close() {
        this.reset();
        this.dispatchEvent(new Event("cancel"));
        this.$dialog.close();
    }

    private isSelected(index:number) {
        return index === this.selectedIndex;
    }

    private textInputChange(event:TextInputChangeEvent) {
        this.searchText = event.value;
        this.dispatchEvent(new SearchPagesEvent({
            text: this.searchText
        }));
    }

    private selectButtonClicked() {
        if (this.selectedIndex === null) {
            return;
        }

        this.dispatchEvent(new PageSelectedEvent(this.pageSearch.state.list[this.selectedIndex]));
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
    'hb-find-page-dialog': FindPageDialog
  }
}
