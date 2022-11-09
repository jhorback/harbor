var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { debounce } from "../common/debounce";
import "../common/hb-button";
import "../common/hb-horizontal-card";
import "../common/hb-text-input";
import { FileType } from "../domain/interfaces/FileInterfaces";
import { styles } from "../styles";
import { SearchFilesController, SearchFilesEvent } from "./SearchFilesController";
export class FileSelectedEvent extends Event {
    constructor(file) {
        super(FileSelectedEvent.eventType);
        this.file = file;
    }
    static { this.eventType = "file-selected"; }
}
/**
 * @fires {@link FileSelectedEvent}
 */
let FindFileDialog = class FindFileDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.fileType = FileType.file;
        this.open = false;
        this.selectedIndex = null;
        this.searchFiles = new SearchFilesController(this);
        this.searchText = "";
    }
    reset() {
        this.searchText = "";
        this.selectedIndex = null;
    }
    render() {
        const state = this.searchFiles.state;
        const selectButtonEnabled = this.selectedIndex !== null
            && state.list[this.selectedIndex];
        return html `
            <dialog @cancel=${this.close}>
                
                <h1 class="headline-small">${this.getDialogTitle(this.fileType)}</h1>

                    <hb-text-input
                        autofocus
                        placeholder="Enter search text"
                        value=${this.searchText}
                        error-text=${this.hasNoResults() ? this.getNoResultsMessage(this.fileType) : ""}
                        @hb-text-input-change=${debounce(this.textInputChange)}
                    ></hb-text-input>

                <div class="list" ?hidden=${state.list.length === 0}>                    
                    ${state.list.map((fileModel, index) => {
            return html `
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
        `;
    }
    getDialogTitle(fileType) {
        return {
            [FileType.audio]: "Find Audio",
            [FileType.video]: "Find Video",
            [FileType.image]: "Find Image",
            [FileType.file]: "Find File"
        }[fileType];
    }
    getNoResultsMessage(fileType) {
        return {
            [FileType.audio]: "There were no audio files found",
            [FileType.video]: "There were no videos found",
            [FileType.image]: "There were no images found",
            [FileType.file]: "There were no files found"
        }[fileType];
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
        this.dispatchEvent(new Event("cancel"));
    }
    isSelected(index) {
        return index === this.selectedIndex;
    }
    textInputChange(event) {
        this.searchText = event.value;
        this.dispatchEvent(new SearchFilesEvent({
            text: this.searchText,
            type: this.fileType
        }));
    }
    selectButtonClicked() {
        if (this.selectedIndex === null) {
            return;
        }
        this.dispatchEvent(new FileSelectedEvent(this.searchFiles.state.list[this.selectedIndex]));
        this.close();
    }
    static { this.styles = [styles.types, styles.dialog, css `
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
  `]; }
};
__decorate([
    property({ type: String, attribute: "file-type" })
], FindFileDialog.prototype, "fileType", void 0);
__decorate([
    property({ type: Boolean })
], FindFileDialog.prototype, "open", void 0);
__decorate([
    query("dialog")
], FindFileDialog.prototype, "$dialog", void 0);
__decorate([
    state()
], FindFileDialog.prototype, "selectedIndex", void 0);
FindFileDialog = __decorate([
    customElement('hb-find-file-dialog')
], FindFileDialog);
export { FindFileDialog };
