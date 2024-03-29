import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { FileType } from "../../../domain/interfaces/FileInterfaces";
import { FileUploadCompleteEvent, FileUploaderAccept, FileUploadPanel } from "../../../files/hb-file-upload-panel";
import "../../../files/hb-find-file-dialog";
import { FileSelectedEvent, FindFileDialog } from "../../../files/hb-find-file-dialog";
import { styles } from "../../../styles";
import { HbPageContent } from "../../hb-page";
import { ImageAlignmentChangeEvent, ImageContentController, ImageContentSelectedEvent, ImageSizeChangeEvent } from "./ImageContentController";
import { DEFAULT_IMAGE_URL, ImageAlignment, ImageSize } from "./imageContentType";

/**
 */
@customElement('hb-image-content')
export class ImageContent extends LitElement {

    get stateId() { return this.pathname; }

    @property({type:String})
    pathname:string = "";

    @property({type:Number, attribute: "content-index"})
    contentIndex:number = -1;

    imageContent:ImageContentController = new ImageContentController(this);

    @query("hb-page-content")
    $hbPageContent!:HbPageContent;

    @query("hb-file-upload-panel")
    $fileUploadPanel!:FileUploadPanel;

    @query("hb-find-file-dialog")
    $findFileDlg!:FindFileDialog;

    render() {
        const state = this.imageContent.content;
        return html`
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${!state.url}>                
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
                <div slot="page-edit-empty" @click=${this.clickedEmpty}>
                    ${this.renderImage(DEFAULT_IMAGE_URL)}
                </div>
                <div slot="content-edit">
                    ${this.renderImage(state.url || DEFAULT_IMAGE_URL)}
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

    private getImageSrcPerSize() {
        const state = this.imageContent.content;
        return state.size === ImageSize.small ?
            state.thumbUrl ? state.thumbUrl :
                state.url : state.url;
    }

    private renderImage(src:string|null) {
        const state = this.imageContent.content;
        return !src ? html`` : html`
            <div size=${state.size} alignment=${state.alignment}>
                <img src=${src}>
            </div>
        `;
    }

    private sizeChanged(event:Event) {
        const size = (event.target as HTMLSelectElement).value as ImageSize;
        this.dispatchEvent(new ImageSizeChangeEvent(size));
    }

    private alignmentChanged(event:Event) {
        const alignment = (event.target as HTMLSelectElement).value as ImageAlignment;
        this.dispatchEvent(new ImageAlignmentChangeEvent(alignment));
    }

    private clickedEmpty() {
        this.$hbPageContent.edit();
    }

    private searchClicked() {
        this.$findFileDlg.open = true;
    }

    private fileSelected(event:FileSelectedEvent) {
        this.dispatchEvent(new ImageContentSelectedEvent({
            url: event.file.url,
            name: event.file.name,
            fileDbPath: event.file.storagePath,
            height: event.file.height||null,
            mediaPosterUrl: event.file.mediaPosterUrl,
            thumbUrl: event.file.thumbUrl,
            type: event.file.type || null,
            width: event.file.width || null
        }));
    }

    private uploadClicked() {
        this.$fileUploadPanel.openFileSelector();
    }

    private fileUploadComplete(event:FileUploadCompleteEvent) {
        event.uploadedFile && this.dispatchEvent(new ImageContentSelectedEvent(event.uploadedFile));
    }

    static styles = [styles.icons, styles.form, css`
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
  `]
}


declare global {
    interface HTMLElementTagNameMap {
        'hb-image-content': ImageContent
    }
}
