import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { linkProp } from "@domx/linkprop";
import { styles } from "../../styles";
import { PageSearchController, SearchPagesEvent } from "../../pages/PageSearchController";
import "../../common/hb-horizontal-card";

/**
 */
@customElement('hb-profile-pages-tab')
export class ProfilePagesTab extends LitElement {

    pageSearch:PageSearchController = new PageSearchController(this);

    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.dispatchEvent(new SearchPagesEvent({}));
    }

    render() {
        const state = this.pageSearch.state;
        return html`
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            ${state.isLoading || state.count !== 0 ? html`` : html`
                <p>There are no pages</p>
            `}
            <div class="list">
            ${state.list.map(pageModel => {
                const thumb = pageModel.toPageThumbnail();
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
    'hb-profile-pages-tab': ProfilePagesTab
  }
}
