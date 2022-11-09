import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { SearchFilesController, SearchFilesEvent } from "../../files/SearchFilesController";
import "../../domain/Files/HbSearchFilesRepo";
import { styles } from "../../styles";


/**
 * @class ProfileContentTab
 */
@customElement('hb-profile-files-tab')
export class ProfileContentTab extends LitElement {

    searchFiles:SearchFilesController = new SearchFilesController(this);

    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.dispatchEvent(new SearchFilesEvent({}));
    }

    render() {
        const state = this.searchFiles.state;
        return html`
            ${state.isLoading || state.count !== 0 ? html`` : html`
                <p>There are no files</p>
            `}
            <div class="list">
            ${state.list.map(fileModel => {                
                return html`
                    <hb-horizontal-card                        
                        text=${fileModel.name}
                        description=${fileModel.thumbDescription}
                        media-url=${fileModel.thumbUrl}
                        media-href=${fileModel.url}
                        link-target="files"
                        
                    ></hb-horizontal-card>
                `;
            })}
            </div>
        `;
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
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-profile-files-tab': ProfileContentTab
  }
}
