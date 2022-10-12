var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { linkProp } from "@domx/linkprop";
import { styles } from "../../styles";
import { SearchDocsData, SearchDocsEvent } from "../../doc/data/hb-search-docs-data";
import "../../common/hb-horizontal-card";
/**
 * @class ProfileDocsTab
 */
let ProfileDocsTab = class ProfileDocsTab extends LitElement {
    constructor() {
        super(...arguments);
        this.state = SearchDocsData.defaultState;
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.$dataEl.dispatchEvent(new SearchDocsEvent({}));
    }
    render() {
        return html `
            <hb-search-docs-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-docs-data>
            ${this.state.isLoading || this.state.count !== 0 ? html `` : html `
                <p>There are no documents</p>
            `}
            <div class="list">
            ${this.state.list.map(docModel => {
            const thumb = docModel.toDocumentThumbnail();
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
    static { this.styles = [styles.types, css `
        :host {
            display: block;
        }
        .list {
            display: grid;
            grid-template-columns: repeat(3, 260px);
            column-gap: 16px;
            row-gap: 16px;
        }
    `]; }
};
__decorate([
    property({ type: Object })
], ProfileDocsTab.prototype, "state", void 0);
__decorate([
    query("hb-search-docs-data")
], ProfileDocsTab.prototype, "$dataEl", void 0);
ProfileDocsTab = __decorate([
    customElement('hb-profile-docs-tab')
], ProfileDocsTab);
export { ProfileDocsTab };
