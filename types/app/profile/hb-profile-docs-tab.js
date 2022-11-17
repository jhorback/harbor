var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { linkProp } from "@domx/linkprop";
import { styles } from "../../styles";
import { PageSearchController, SearchPagesEvent } from "../../pages/PageSearchController";
import "../../common/hb-horizontal-card";
/**
 * @class ProfileDocsTab
 */
let ProfileDocsTab = class ProfileDocsTab extends LitElement {
    constructor() {
        super(...arguments);
        this.pageSearch = new PageSearchController(this);
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.dispatchEvent(new SearchPagesEvent({}));
    }
    render() {
        const state = this.pageSearch.state;
        return html `
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            ${state.isLoading || state.count !== 0 ? html `` : html `
                <p>There are no documents</p>
            `}
            <div class="list">
            ${state.list.map(pageModel => {
            const thumb = pageModel.toPageThumbnail();
            return html `
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
};
ProfileDocsTab.styles = [styles.types, css `
        :host {
            display: block;
        }
        .list {
            display: grid;
            grid-template-columns: repeat(3, 260px);
            column-gap: 16px;
            row-gap: 16px;
        }
    `];
ProfileDocsTab = __decorate([
    customElement('hb-profile-docs-tab')
], ProfileDocsTab);
export { ProfileDocsTab };
