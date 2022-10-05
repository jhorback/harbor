import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { linkProp } from "@domx/linkprop";
import { styles } from "../../styles";
import { ISearchDocsState, SearchDocsData, SearchDocsEvent } from "../../doc/data/hb-search-docs-data";
import "../../common/hb-horizontal-card";

/**
 * @class ProfileDocsTab
 */
@customElement('hb-profile-docs-tab')
export class ProfileDocsTab extends LitElement {

    @property({type: Object})
    state:ISearchDocsState = SearchDocsData.defaultState;

    @query("hb-search-docs-data")
    $dataEl!:SearchDocsData;

    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.$dataEl.dispatchEvent(new SearchDocsEvent({}));
    }

    render() {
        return html`
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            ${this.state.isLoading || this.state.count !== 0 ? html`` : html`
                <p>There are no documents</p>
            `}
            <div class="list">
            ${this.state.list.map(docModel => {
                const thumb = docModel.toDocumentThumbnail();
                return html`
                    <hb-horizontal-card
                        class="home-page-thumb"
                        text=${thumb.title}
                        description=${thumb.thumbDescription}
                        media-url=${thumb.thumbUrl}
                        media-href=${thumb.href}
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
    'hb-profile-docs-tab': ProfileDocsTab
  }
}
