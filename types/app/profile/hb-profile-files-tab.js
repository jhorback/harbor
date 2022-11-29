var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { SearchFilesController, SearchFilesEvent } from "../../files/SearchFilesController";
import "../../domain/Files/HbSearchFilesRepo";
import "../../files/hb-file-viewer";
import { styles } from "../../styles";
/**
 * @class ProfileContentTab
 */
let ProfileContentTab = class ProfileContentTab extends LitElement {
    constructor() {
        super(...arguments);
        this.searchFiles = new SearchFilesController(this);
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.dispatchEvent(new SearchFilesEvent({}));
    }
    render() {
        const state = this.searchFiles.state;
        return html `
            <hb-file-viewer
                detail-pane
                .files=${state.list}
            ></hb-file-viewer>
            ${state.isLoading || state.count !== 0 ? html `` : html `
                <p>There are no files</p>
            `}
            <div class="list">
            ${state.list.map(fileModel => {
            return html `
                    <hb-horizontal-card                        
                        text=${fileModel.name}
                        description=${fileModel.thumbDescription}
                        link-target="files"
                        media-url=${fileModel.thumbUrl}
                        xxx-media-href=${fileModel.url}
                        @click=${() => this.fileClicked(fileModel.name)}
                    ></hb-horizontal-card>
                `;
        })}
            </div>
        `;
    }
    fileClicked(fileName) {
        this.$fileViewer.show(fileName);
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
        hb-horizontal-card {
            --hb-horizontal-card-cursor: pointer;
        }
    `];
__decorate([
    query("hb-file-viewer")
], ProfileContentTab.prototype, "$fileViewer", void 0);
ProfileContentTab = __decorate([
    customElement('hb-profile-files-tab')
], ProfileContentTab);
export { ProfileContentTab };
