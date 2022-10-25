import { linkProp } from "@domx/dataelement";
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { ISearchFilesState, SearchFilesData, SearchFilesEvent } from "../../files/data/hb-search-files-data";
import { styles } from "../../styles";


/**
 * @class ProfileContentTab
 */
@customElement('hb-profile-files-tab')
export class ProfileContentTab extends LitElement {

    @property({type: Object})
    state:ISearchFilesState = SearchFilesData.defaultState;

    @query("hb-search-files-data")
    $dataEl!:SearchFilesData;

    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.$dataEl.dispatchEvent(new SearchFilesEvent({}));
    }

    render() {
        return html`
            <hb-search-files-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-files-data>
            ${this.state.isLoading || this.state.count !== 0 ? html`` : html`
                <p>There are no files</p>
            `}
            <div class="list">
            ${this.state.list.map(fileModel => {                
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
