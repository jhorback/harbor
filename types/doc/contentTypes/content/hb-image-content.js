var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ImageContent_1;
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../../styles";
import { ImageContentDataState } from "../imageContentType";
import "../hb-content";
/**
 */
let ImageContent = ImageContent_1 = class ImageContent extends LitElement {
    constructor() {
        super(...arguments);
        this.contentIndex = -1;
        this.state = ImageContent_1.defaultState;
        this.inEditMode = false;
        this.isEmpty = false;
    }
    render() {
        return html `
            <hb-content ?is-empty=${!this.state.url}>                
                <div>
                    ${this.renderImage(this.state.url)}
                </div>
                <div slot="edit-toolbar">
                    <span
                        class="icon-button icon-small"
                        tab-index="0"
                        @click=${this.searchClicked}
                        title="Search for an image">
                        search
                    </span>
                    <span
                        class="icon-button icon-small"
                        tab-index="0"
                        @click=${this.uploadClicked}
                        title="Upload an image">
                        file_upload
                    </span>
                </div>
                <div slot="doc-edit-empty" @click=${this.clickedEmpty}>
                    ${this.renderImage("/content/thumbs/files-thumb.svg")}
                </div>
                <div slot="content-edit">
                    ${this.renderImage(this.state.url || "/content/thumbs/files-thumb.svg")}
                </div>
                <div slot="content-edit-tools">
                    IMAGE EDIT TOOLS<br>
                    And here are some<br>
                    Taller tools<br>
                    How does this display?
                </div>
            </hb-content>
        `;
    }
    renderImage(src) {
        return !src ? html `` : html `
            <div size=${this.state.size} alignment=${this.state.alignment}>
                <img src=${src}>
            </div>
        `;
    }
    clickedEmpty() {
        this.$hbContent.edit();
    }
    searchClicked() {
        alert("Find image");
    }
    uploadClicked() {
        alert("Upload image");
    }
};
ImageContent.defaultState = new ImageContentDataState();
ImageContent.styles = [styles.icons, css `
        :host {
            display: block;
            position: relative;
        }
        div[size=small] img {
            width: 100px;
        }
        div[size=medium] img {
            width: 300px;
        }
        div[size=large] img {
            width: 600px;
            max-width: 100%;
        }
        div[alignment=left] {
            text-align: left;
        }
        div[alignment=center] {
            text-align: center;
        }
        div[alignment=right] {
            text-align: right;
        }
        div[slot="content-edit-tools"] {
            padding: 8px;
        }
  `];
__decorate([
    property({ type: Number })
], ImageContent.prototype, "contentIndex", void 0);
__decorate([
    property({ type: Object })
], ImageContent.prototype, "state", void 0);
__decorate([
    state()
], ImageContent.prototype, "inEditMode", void 0);
__decorate([
    query("hb-content")
], ImageContent.prototype, "$hbContent", void 0);
__decorate([
    property({ type: Boolean, attribute: "is-empty" })
], ImageContent.prototype, "isEmpty", void 0);
ImageContent = ImageContent_1 = __decorate([
    customElement('hb-image-content')
], ImageContent);
export { ImageContent };
