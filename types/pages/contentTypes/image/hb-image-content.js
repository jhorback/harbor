var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../../styles";
import { ImageSize } from "./imageContentType";
import "../hb-content";
import { FileUploaderAccept } from "../../../files/hb-file-upload-panel";
import "../../../files/hb-find-file-dialog";
import { FileType } from "../../../domain/interfaces/FileInterfaces";
import { ImageAlignmentChangeEvent, ImageContentController, ImageContentSelectedEvent, ImageSizeChangeEvent } from "./ImageContentController";
/**
 */
let ImageContent = class ImageContent extends LitElement {
    constructor() {
        super(...arguments);
        this.docUid = "";
        this.contentIndex = -1;
        this.imageContent = new ImageContentController(this);
    }
    get stateId() { return `${this.docUid}:content:${this.contentIndex}`; }
    render() {
        const state = this.imageContent.state;
        return html `
            <hb-page-content ?is-empty=${!state.url}>                
                <div>
                    ${this.renderImage(this.getImageSrcPerSize())}
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
                    ${this.renderImage(state.url || "/content/thumbs/files-thumb.svg")}
                    <hb-file-upload-panel
                        accept=${FileUploaderAccept.images}
                        @file-upload-complete=${this.fileUploadComplete}
                    ></hb-file-upload-panel>
                    <hb-find-file-dialog
                        file-type=${FileType.image}
                        @file-selected=${this.fileSelected}
                    ></hb-find-file-dialog>
                </div>
                <div slot="content-edit-tools">
                    <div>
                        <label for="size">Size</label>
                        <select id="size" .value=${state.size} @change=${this.sizeChanged}>
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                        </select>
                    </div>
                    <div>
                        <label for="alignment">Alignment</label>
                        <select id="alignment" .value=${state.alignment} @change=${this.alignmentChanged}>
                            <option value="left">Left</option>
                            <option value="center">Center</option>
                            <option value="right">Right</option>
                        </select>
                    </div>
                </div>
            </hb-page-content>
        `;
    }
    getImageSrcPerSize() {
        const state = this.imageContent.state;
        return state.size === ImageSize.small ?
            state.thumbUrl ? state.thumbUrl :
                state.url : state.url;
    }
    renderImage(src) {
        const { state } = this.imageContent;
        return !src ? html `` : html `
            <div size=${state.size} alignment=${state.alignment}>
                <img src=${src}>
            </div>
        `;
    }
    sizeChanged(event) {
        const size = event.target.value;
        this.dispatchEvent(new ImageSizeChangeEvent(size));
    }
    alignmentChanged(event) {
        const alignment = event.target.value;
        this.dispatchEvent(new ImageAlignmentChangeEvent(alignment));
    }
    clickedEmpty() {
        this.$hbPageContent.edit();
    }
    searchClicked() {
        this.$findFileDlg.open = true;
    }
    fileSelected(event) {
        this.dispatchEvent(new ImageContentSelectedEvent({
            url: event.file.url,
            name: event.file.name,
            fileDbPath: event.file.storagePath,
            height: event.file.height || null,
            pictureUrl: event.file.pictureUrl,
            thumbUrl: event.file.thumbUrl,
            type: event.file.type || null,
            width: event.file.width || null
        }));
    }
    uploadClicked() {
        this.$fileUploadPanel.openFileSelector();
    }
    fileUploadComplete(event) {
        event.uploadedFile && this.dispatchEvent(new ImageContentSelectedEvent(event.uploadedFile));
    }
};
ImageContent.styles = [styles.icons, styles.form, css `
        :host {
            display: block;
            position: relative;
        }
        div[size=small] img {
            width: 250px;
        }
        div[size=medium] img {
            width: 500px;
        }
        div[size=large] img {
            width: 1000px;
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
  `];
__decorate([
    property({ type: String })
], ImageContent.prototype, "docUid", void 0);
__decorate([
    property({ type: Number })
], ImageContent.prototype, "contentIndex", void 0);
__decorate([
    property({ type: Object })
], ImageContent.prototype, "data", void 0);
__decorate([
    query("hb-page-content")
], ImageContent.prototype, "$hbPageContent", void 0);
__decorate([
    query("hb-file-upload-panel")
], ImageContent.prototype, "$fileUploadPanel", void 0);
__decorate([
    query("hb-find-file-dialog")
], ImageContent.prototype, "$findFileDlg", void 0);
ImageContent = __decorate([
    customElement('hb-image-content')
], ImageContent);
export { ImageContent };
