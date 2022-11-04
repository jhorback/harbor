var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../../styles";
import "../hb-content";
import { ImageAlignmentChangeEvent, ImageContentData, ImageContentSelectedEvent, ImageSizeChangeEvent } from "./hb-image-content-data";
import { linkProp } from "@domx/dataelement";
import { FileUploadPanel, FileUploaderAccept } from "../../../files/hb-file-upload-panel";
/**
 */
let ImageContent = class ImageContent extends LitElement {
    constructor() {
        super(...arguments);
        this.docUid = "";
        this.contentIndex = -1;
        this.state = ImageContentData.defaultState;
        this.inEditMode = false;
    }
    render() {
        return html `
            <hb-image-content-data
                uid=${`${this.docUid}:content:${this.contentIndex}`}
                content-index=${this.contentIndex}
                .state=${this.state}
                @state-change=${linkProp(this, "state")}
            ></hb-image-content-data>
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
                    <div>
                        <label for="size">Size</label>
                        <select id="size" .value=${this.state.size} @change=${this.sizeChanged}>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <div>
                        <label for="alignment">Alignment</label>
                        <select id="alignment" .value=${this.state.alignment} @change=${this.alignmentChanged}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
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
    sizeChanged(event) {
        const size = event.target.value;
        this.$dataEl.dispatchEvent(new ImageSizeChangeEvent(size));
    }
    alignmentChanged(event) {
        const alignment = event.target.value;
        this.$dataEl.dispatchEvent(new ImageAlignmentChangeEvent(alignment));
    }
    clickedEmpty() {
        this.$hbContent.edit();
    }
    searchClicked() {
        alert("Find image");
    }
    uploadClicked() {
        FileUploadPanel.openFileSelector({
            accept: FileUploaderAccept.images,
            onUploadComplete: (event) => {
                event.uploadedFile && this.$dataEl.dispatchEvent(new ImageContentSelectedEvent(event.uploadedFile));
            }
        });
    }
};
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
            display: flex;
            gap: 36px;
        }
        div[slot="content-edit-tools"] > div {
            flex-grow: 1;
        }
        div[slot="content-edit-tools"] > :first-child {
            text-align: right;
        }
        label {
            margin-right: 8px;
        }
        select {
            display: inline-block;
            min-width: 112px;
            max-width: 280px;
            height: 48px;
            outline: none;
            border: 1px solid var(--md-sys-color-outline);
            border-radius: var(--md-sys-shape-corner-small);
            padding: 0 12px;            
        }
  `];
__decorate([
    property({ type: String })
], ImageContent.prototype, "docUid", void 0);
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
    query("hb-image-content-data")
], ImageContent.prototype, "$dataEl", void 0);
ImageContent = __decorate([
    customElement('hb-image-content')
], ImageContent);
export { ImageContent };
