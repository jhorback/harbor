var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { linkProp } from "@domx/dataelement";
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { SearchFilesData, SearchFilesEvent } from "../../files/data/hb-search-files-data";
import { styles } from "../../styles";
/**
 * @class ProfileContentTab
 */
let ProfileContentTab = class ProfileContentTab extends LitElement {
    constructor() {
        super(...arguments);
        this.state = SearchFilesData.defaultState;
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.$dataEl.dispatchEvent(new SearchFilesEvent({}));
    }
    render() {
        return html `
            <hb-search-files-data
                @state-changed=${linkProp(this, "state")}
            ></hb-search-files-data>
            ${this.state.isLoading || this.state.count !== 0 ? html `` : html `
                <p>There are no files</p>
            `}
            <div class="list">
            ${this.state.list.map(fileModel => {
            return html `
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
};
ProfileContentTab.styles = [styles.types, css `
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
__decorate([
    property({ type: Object })
], ProfileContentTab.prototype, "state", void 0);
__decorate([
    query("hb-search-files-data")
], ProfileContentTab.prototype, "$dataEl", void 0);
ProfileContentTab = __decorate([
    customElement('hb-profile-files-tab')
], ProfileContentTab);
export { ProfileContentTab };
