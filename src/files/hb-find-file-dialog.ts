import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import "../common/hb-button";
import "../common/hb-horizontal-card";
import "../common/hb-text-input";
import { TextInputChangeEvent } from "../common/hb-text-input";
import { SearchFilesController, SearchFilesEvent } from "./SearchFilesController";
import { debounce } from "../common/debounce";
import { FileModel } from "../domain/Files/FileModel";


export class FileSelectedEvent extends Event {
    static eventType = "file-selected";
    file:FileModel;
    constructor(file:FileModel) {
        super(FileSelectedEvent.eventType);
        this.file = file;
    }
}


/**  
 * @fires {@link FileSelectedEvent}
 */
@customElement('hb-find-file-dialog')
export class FindFileDialog extends LitElement {

    @property({type:Boolean})
    open = false;

    @query("dialog")
    $dialog!:HTMLDialogElement;

    @state()
    selectedIndex:number|null = null;

    searchFiles:SearchFilesController = new SearchFilesController(this);

    searchText = "";

    private reset() {
        this.searchText = "";
        this.selectedIndex = null;
    }

    render() {
        const state = this.searchFiles.state;
        const selectButtonEnabled = this.selectedIndex !== null
            && state.list[this.selectedIndex];

        return html`
            <dialog>
                
                <h1 class="headline-small">Find File</h1>

                    <hb-text-input
                        autofocus
                        placeholder="Enter search text"
                        value=${this.searchText}
                        error-text=${this.hasNoResults() ? "There were no files found" : ""}
                        @hb-text-input-change=${debounce(this.textInputChange)}
                    ></hb-text-input>

                <div class="list" ?hidden=${state.list.length === 0}>                    
                    ${state.list.map((fileModel, index) => {                
                        return html`
                            <hb-horizontal-card                        
                                text=${fileModel.name}
                                description=${fileModel.thumbDescription}
                                media-url=${fileModel.thumbUrl}
                                xmedia-href=${fileModel.url}
                                link-target="files"
                                ?selected=${this.isSelected(index)} 
                                @hb-horizontal-card-click=${() => this.selectedIndex = index}
                            ></hb-horizontal-card>
                    `;
                    })}

                </div>

                <hr ?hidden=${state.list.length === 0}>

                <div class="dialog-buttons">
                    <hb-button
                        text-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
                        text-button
                        label="Select File"
                        ?disabled=${this.iSelectButtonDisabled()}
                        @click=${this.selectButtonClicked}
                    ></hb-button>
                </div>                
            </dialog>
        `
    }

    hasNoResults() {
        const state = this.searchFiles.state;
        return this.searchText.length > 0 && state.isLoading === false && state.count === 0;
    }

    updated() {
        this.open && !this.$dialog.open && this.$dialog.showModal();
        !this.open && this.$dialog.close();
    }

    iSelectButtonDisabled() {
       return this.selectedIndex === null
            || this.searchFiles.state.list[this.selectedIndex] === undefined;
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
        this.dispatchEvent(new SearchFilesEvent({
            text: this.searchText
        }));
    }

    private selectButtonClicked() {
        if (this.selectedIndex === null) {
            return;
        }

        this.dispatchEvent(new FileSelectedEvent(this.searchFiles.state.list[this.selectedIndex]));
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
    'hb-find-file-dialog': FindFileDialog
  }
}
