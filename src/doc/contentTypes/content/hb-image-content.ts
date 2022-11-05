import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../../styles";
import { ImageAlignment, ImageContentDataState, ImageSize } from "../imageContentType";
import "../hb-content";
import { HbContent } from "../hb-content";
import { ImageAlignmentChangeEvent, ImageContentData, ImageContentSelectedEvent, ImageSizeChangeEvent } from "./hb-image-content-data";
import { linkProp } from "@domx/dataelement";
import { FileUploadCompleteEvent, FileUploadPanel, FileUploaderAccept } from "../../../files/hb-file-upload-panel";
import "../../../files/hb-find-file-dialog";
import { FileSelectedEvent, FindFileDialog } from "../../../files/hb-find-file-dialog";
import { FileType } from "../../../domain/interfaces/FileInterfaces";

/**
 */
@customElement('hb-image-content')
export class ImageContent extends LitElement {

    @property({type:String})
    docUid:string = "";

    @property({type:Number})
    contentIndex:number = -1;

    @property({type: Object})
    state:ImageContentDataState = ImageContentData.defaultState;

    @state()
    inEditMode = false;

    @query("hb-content")
    $hbContent!:HbContent;

    @query("hb-file-upload-panel")
    $fileUploadPanel!:FileUploadPanel;

    @query("hb-find-file-dialog")
    $findFileDlg!:FindFileDialog;

    @query("hb-image-content-data")
    $dataEl!:ImageContentData;

    render() {
        return html`
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

    private renderImage(src:string|null) {
        return !src ? html`` : html`
            <div size=${this.state.size} alignment=${this.state.alignment}>
                <img src=${src}>
            </div>
        `;
    }

    private sizeChanged(event:Event) {
        const size = (event.target as HTMLSelectElement).value as ImageSize;
        this.$dataEl.dispatchEvent(new ImageSizeChangeEvent(size));
    }

    private alignmentChanged(event:Event) {
        const alignment = (event.target as HTMLSelectElement).value as ImageAlignment;
        this.$dataEl.dispatchEvent(new ImageAlignmentChangeEvent(alignment));
    }

    private clickedEmpty() {
        this.$hbContent.edit();
    }

    private searchClicked() {
        this.$findFileDlg.open = true;
    }

    private fileSelected(event:FileSelectedEvent) {
        this.$dataEl.dispatchEvent(new ImageContentSelectedEvent({
            url: event.file.url,
            name: event.file.name,
            fileDbPath: event.file.storagePath
        }));
    }

    private uploadClicked() {
        this.$fileUploadPanel.openFileSelector();
    }

    private fileUploadComplete(event:FileUploadCompleteEvent) {
        event.uploadedFile && this.$dataEl.dispatchEvent(new ImageContentSelectedEvent(event.uploadedFile));
    }

    static styles = [styles.icons, css`
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
  `]
}


declare global {
    interface HTMLElementTagNameMap {
        'hb-image-content': ImageContent
    }
}
