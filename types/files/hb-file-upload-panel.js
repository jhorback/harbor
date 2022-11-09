var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var FileUploadPanel_1;
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
import "../common/hb-button";
import { CancelUploadEvent, FileUploadController, OverwriteFileEvent } from "./FileUploadController";
import { sendFeedback } from "../layout/feedback";
export var FileUploaderAccept;
(function (FileUploaderAccept) {
    FileUploaderAccept["images"] = "images";
    FileUploaderAccept["audio"] = "audio";
    FileUploaderAccept["video"] = "video";
    FileUploaderAccept["media"] = "media";
    FileUploaderAccept["all"] = "all";
})(FileUploaderAccept || (FileUploaderAccept = {}));
/**
 * Dispatched on the element when files have finished uploading.
 */
export class FileUploadCompleteEvent extends Event {
    constructor(uploadedFiles) {
        super(FileUploadCompleteEvent.eventType);
        this.uploadedFiles = uploadedFiles;
        this.uploadedFile = uploadedFiles[0];
    }
}
FileUploadCompleteEvent.eventType = "file-upload-complete";
/**
 * Opens a file selector to upload files.
 *
 * Usage:
 * You can add the element to the DOM with the "accept" {@link FileUploaderAccept} and optional "multiple" attributes.
 * Then add an event listener on the element for the {@link FileUploadCompleteEvent} to be notified of the uploaded files.
 * When the element is in the DOM, you can call `openFileSelector()` when needed.
 *
 * There is also a static method that will do this programmatically {@link FileUploadPanel.openFileSelector}
 */
let FileUploadPanel = FileUploadPanel_1 = class FileUploadPanel extends LitElement {
    constructor() {
        super(...arguments);
        this.fileUploader = new FileUploadPanel_1.fileUploaderType(this);
        this.accept = FileUploaderAccept.images;
        this.multiple = false;
        this.open = false;
        this.viewSkipped = false;
    }
    /**
     * Helper method to create the upload panel and add it to the DOM
     * @param options
     * @returns
     */
    static openFileSelector(options) {
        const panel = document.createElement("hb-file-upload-panel");
        panel.setAttribute("accept", options.accept);
        options.multiple && panel.setAttribute("multiple", "");
        options.onUploadComplete && panel.addEventListener(FileUploadCompleteEvent.eventType, options.onUploadComplete);
        document.body.appendChild(panel);
        panel.openFileSelector();
        return panel;
    }
    openFileSelector() {
        if (FileUploadPanel_1.panel !== null) {
            sendFeedback({ message: "There is a file upload already in progress" });
            return;
        }
        this.fileUploader.openFileSelector();
    }
    /** Method for the FileUploadController to show the panel when files are received */
    showPanel() {
        FileUploadPanel_1.panel = this;
        this.open = true;
    }
    render() {
        const state = this.fileUploader.state;
        if (state.isComplete && state.skippedFiles.length === 0) {
            setTimeout(this.close.bind(this), 2000);
        }
        return html `
            <div class="container">
                ${!state.isComplete ? html `
                    <div class="image-container">
                        ${state.highlightFileSrc ? html `
                            <div id="thumbnail" style="background-image: url(${state.highlightFileSrc})"></div>
                        ` : html ``}
                    </div>
                ` : state.skippedFiles.length > 0 ? html `
                    <div class="warning-container">
                        <span class="material-symbols-outlined icon-small">warning</span>
                    </div>
                ` : html ``}                
                <div class="text-container">
                    <div class="msg-container">
                        <div class="text">
                            ${state.requiresOverwrite ? html `
                                <div class="body-small quiet">File already exists</div>
                                <div class="title-medium">Overwrite file?</div>
                                <div class="body-small">${state.requiresOverwriteFileName}</div>
                            ` : !state.isComplete ? html `
                                <div class="body-small empty"></div>
                                <div class="title-medium">Uploading ${state.uploadFileTypes}</div>
                                <div class="body-small quiet">${state.percentComplete}% complete</div>
                            ` : html `
                                <div class="done-container">
                                    <div class="title-medium">
                                        ${state.skippedFiles.length > 0 ? html `
                                            Can't upload ${state.skippedFiles.length} items
                                        ` : html `
                                            Finished uploading files
                                        `}                                        
                                    </div>
                                    <div class="body-small of-uploads">
                                        ${state.skippedFiles.length > 0 && !this.viewSkipped ? html `
                                            Out of ${state.ofFile} uploads
                                        ` : state.skippedFiles.length > 0 ? html `
                                            ${state.skippedFiles.map(file => html `
                                                <div class="body-medium skipped">
                                                    <span class="material-symbols-outlined icon-small">draft</span>
                                                    <span>${file}</span>
                                                </div>
                                            `)}
                                        ` : html `
                                            ${state.ofFile} uploads
                                        `}
                                    </div>
                                </div>                                
                            `}
                        </div>
                        ${state.isComplete ? html `
                            <div class="icon"><span class="icon-button icon-small" @click=${this.close}>close</span></div>
                        ` : html ``}
                    </div>
                    <div class="buttons">
                        ${state.requiresOverwrite ? html `
                            <hb-button text-button label="Skip" @click=${this.skipFile}></hb-button>
                            <hb-button text-button label="Overwrite" @click=${this.overwriteFile}></hb-button>
                        ` : !state.isComplete ? html `
                            <hb-button label="Stop" @click=${this.cancelUpload}></hb-button>
                        ` : state.skippedFiles.length > 0 && !this.viewSkipped ? html `
                            <hb-button text-button label="View Skipped" @click=${this.viewSkippedClicked}></hb-button>                        
                        ` : html ``}
                    </div>
                </div>
            </div>
        `;
    }
    skipFile(event) {
        const { requiresOverwriteFileIndex } = this.fileUploader.state;
        this.dispatchEvent(new OverwriteFileEvent(requiresOverwriteFileIndex, false));
    }
    overwriteFile(event) {
        const { requiresOverwriteFileIndex } = this.fileUploader.state;
        this.dispatchEvent(new OverwriteFileEvent(requiresOverwriteFileIndex, true));
    }
    cancelUpload(event) {
        this.dispatchEvent(new CancelUploadEvent());
    }
    viewSkippedClicked() {
        this.viewSkipped = true;
    }
    close() {
        this.open = false;
        FileUploadPanel_1.panel = null;
    }
};
// Stores the panel element (singleton)
FileUploadPanel.panel = null;
/** seem for mocking */
FileUploadPanel.fileUploaderType = FileUploadController;
FileUploadPanel.styles = [styles.types, styles.icons, css `
        :host {
            z-index: 2000;
            background-color: var(--md-sys-color-surface-variant);
            color: var(--md-sys-color-on-surface);
            border-radius: 8px;
            user-select: none;
            width: 300px;

            position: fixed;
            display: inline-block;
            right: 16px;

            transition: bottom 500ms;
            bottom: -116px;
            max-height: calc(100% - 32px);
        }
        :host([view-skipped]) {
            overflow: auto;
        }
        :host([view-skipped]:not([open])) {
            bottom: -500px;
        }
        :host([open]) {
            bottom: 16px;
        }
        .container {
            display: flex;
        }
        .image-container, .image-container #thumbnail {
            background-color: #d9d9d9;
            border-radius: 8px 0 0 8px;
            width: 100px;
            height: 100px;
        }
        .image-container #thumbnail {
            overflow: hidden;
            background-size: cover;
        }

        .text-container {
            flex-grow:1;
            display: flex;
            flex-direction: column;
        }

        .msg-container {
            display: flex;
            flex-grow: 1;
        }
        .msg-container .text {
            padding: 4px;
            padding-left: 8px;
            flex-grow: 1;
        }
        .msg-container .icon {
            padding: 4px;
        }
        .quiet {
            opacity: 50%;
        }
        .buttons {
            position: relative;
            bottom: 0;
            right: 0;
            text-align:right;
            padding: 0 4px 4px 4px;
        }
        .empty:before {
            content: ".";
            visibility: hidden;
        }
        .msg-container .icon {

        }
        .done-container {
            padding: 8px;
        }
        .warning-container span {
            color: #FBBC04;
            padding: 16px 0 16px 16px;
        }
        .of-uploads {
            padding-top: 8px;
        }
        .skipped {
            display:flex;
            align-items: center;
        }
    `];
__decorate([
    property({ type: String })
], FileUploadPanel.prototype, "accept", void 0);
__decorate([
    property({ type: Boolean })
], FileUploadPanel.prototype, "multiple", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], FileUploadPanel.prototype, "open", void 0);
__decorate([
    property({ type: Boolean, attribute: "view-skipped", reflect: true })
], FileUploadPanel.prototype, "viewSkipped", void 0);
FileUploadPanel = FileUploadPanel_1 = __decorate([
    customElement('hb-file-upload-panel')
], FileUploadPanel);
export { FileUploadPanel };
