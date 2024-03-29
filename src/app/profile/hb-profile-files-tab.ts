import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { SearchFilesController, SearchFilesEvent } from "../../files/SearchFilesController";
import "../../domain/Files/HbSearchFilesRepo";
import "../../files/hb-file-viewer/hb-file-viewer";
import { styles } from "../../styles";
import { FileViewer } from "../../files/hb-file-viewer";


/**
 * @class ProfileContentTab
 */
@customElement('hb-profile-files-tab')
export class ProfileContentTab extends LitElement {

    searchFiles:SearchFilesController = new SearchFilesController(this);

    @query("hb-file-viewer")
    $fileViewer!:FileViewer;

    connectedCallback() {
        super.connectedCallback();
        this.requestFiles();
    }

    async requestFiles() {
        await this.updateComplete;
        this.dispatchEvent(new SearchFilesEvent({}));
    }

    render() {
        const state = this.searchFiles.state;

        return html`
            <hb-file-viewer
                show-details
                @close-file-viewer=${this.requestFiles}
                .files=${state.list}
            ></hb-file-viewer>
            ${state.isLoading || state.count !== 0 ? html`` : html`
                <p>There are no files</p>
            `}
            <div class="list">
            ${state.list.map(fileModel => {                
                return html`
                    <hb-horizontal-card                        
                        text=${fileModel.name}
                        description=${fileModel.thumbDescription}
                        link-target="files"
                        media-url=${fileModel.thumbUrl || fileModel.defaultThumb}                        
                        @click=${() => this.fileClicked(fileModel.name)}
                    ></hb-horizontal-card>
                `;
            })}
            </div>
        `;
    }

    updated() {
        if (this.searchFiles.state.hasLoaded) {           
            const fileName = this.$fileViewer.getFileNameFromUrl();
            fileName && this.fileClicked(fileName);
        }
    }

    fileClicked(fileName:string) {
        this.$fileViewer.show(fileName);        
    }

    static styles = [styles.types, css`
        :host {
            display: block;
        }
        .list {
            display: grid;
            grid-template-columns: repeat(3, 260px);
            column-gap: 16px;
            row-gap: 16px;
        }
        hb-horizontal-card {
            --hb-horizontal-card-cursor: pointer;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-profile-files-tab': ProfileContentTab
  }
}
