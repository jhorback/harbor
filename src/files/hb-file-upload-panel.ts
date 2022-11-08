import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
import "../common/hb-button";
import { CancelUploadEvent, FileUploadController, OverwriteFileEvent } from "./FileUploadController";
import { IUploadedFile } from "../domain/interfaces/FileInterfaces";
import { sendFeedback } from "../layout/feedback";


export interface IFileUploadOptions {
    accept: FileUploaderAccept;
    multiple?: boolean;
    onUploadComplete?: (event:FileUploadCompleteEvent) => void;
}

export enum FileUploaderAccept {
    images = "images",
    audio = "audio",
    video = "video",
    media = "media"
}

/**
 * Dispatched on the element when files have finished uploading.
 */
 export class FileUploadCompleteEvent extends Event {
    static eventType = "file-upload-complete";
    uploadedFile:IUploadedFile|null;
    uploadedFiles:Array<IUploadedFile>;
    constructor(uploadedFiles:Array<IUploadedFile>) {
        super(FileUploadCompleteEvent.eventType);
        this.uploadedFiles = uploadedFiles;
        this.uploadedFile = uploadedFiles[0];
    }
}


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
@customElement('hb-file-upload-panel')
export class FileUploadPanel extends LitElement {

    // Stores the panel element (singleton)
    private static panel:FileUploadPanel|null = null;

    /**
     * Helper method to create the upload panel and add it to the DOM
     * @param options 
     * @returns 
     */
    static openFileSelector(options:IFileUploadOptions) {
        const panel = document.createElement("hb-file-upload-panel");
        panel.setAttribute("accept", options.accept);
        options.multiple && panel.setAttribute("multiple", "");
        options.onUploadComplete && panel.addEventListener(FileUploadCompleteEvent.eventType,
            options.onUploadComplete as EventListener);
        document.body.appendChild(panel);
        panel.openFileSelector();
        return panel;
    }

    /** seem for mocking */
    public static fileUploaderType:typeof FileUploadController = FileUploadController;

    private fileUploader:FileUploadController = new FileUploadPanel.fileUploaderType(this);

    @property({type: String})
    accept: FileUploaderAccept = FileUploaderAccept.images;

    @property({type: Boolean})
    multiple: boolean = false;

    @property({type:Boolean, reflect: true}) 
    open = false;

    @property({type:Boolean, attribute:"view-skipped", reflect: true})
    viewSkipped = false;

    openFileSelector() {
        if (FileUploadPanel.panel !== null) {
            sendFeedback({ message: "There is a file upload already in progress"});
            return;
        }
        this.fileUploader.openFileSelector();
    }

    /** Method for the FileUploadController to show the panel when files are received */
    showPanel() {
        FileUploadPanel.panel = this;
        this.open = true;        
    }

    render() {
        const state = this.fileUploader.state;
        if (state.isComplete && state.skippedFiles.length === 0) {
            setTimeout(this.close.bind(this), 2000);
        }

        return html`
            <div class="container">
                ${!state.isComplete ? html`
                    <div class="image-container">
                        ${state.highlightFileSrc ? html`
                            <div id="thumbnail" style="background-image: url(${state.highlightFileSrc})"></div>
                        ` : html``}
                    </div>
                ` : state.skippedFiles.length > 0 ? html`
                    <div class="warning-container">
                        <span class="material-symbols-outlined icon-small">warning</span>
                    </div>
                ` : html``}                
                <div class="text-container">
                    <div class="msg-container">
                        <div class="text">
                            ${state.requiresOverwrite ? html`
                                <div class="body-small quiet">File already exists</div>
                                <div class="title-medium">Overwrite file?</div>
                                <div class="body-small">${state.requiresOverwriteFileName}</div>
                            ` : !state.isComplete ? html`
                                <div class="body-small empty"></div>
                                <div class="title-medium">Uploading ${state.uploadFileTypes}</div>
                                <div class="body-small quiet">${state.percentComplete}% complete</div>
                            ` : html`
                                <div class="done-container">
                                    <div class="title-medium">
                                        ${state.skippedFiles.length > 0 ? html`
                                            Can't upload ${state.skippedFiles.length} items
                                        ` : html`
                                            Finished uploading files
                                        `}                                        
                                    </div>
                                    <div class="body-small of-uploads">
                                        ${state.skippedFiles.length > 0 && !this.viewSkipped ? html`
                                            Out of ${state.ofFile} uploads
                                        ` : state.skippedFiles.length > 0 ? html`
                                            ${state.skippedFiles.map(file => html`
                                                <div class="body-medium skipped">
                                                    <span class="material-symbols-outlined icon-small">draft</span>
                                                    <span>${file}</span>
                                                </div>
                                            `)}
                                        ` : html`
                                            ${state.ofFile} uploads
                                        `}
                                    </div>
                                </div>                                
                            `}
                        </div>
                        ${state.isComplete ? html`
                            <div class="icon"><span class="icon-button icon-small" @click=${this.close}>close</span></div>
                        ` : html``}
                    </div>
                    <div class="buttons">
                        ${state.requiresOverwrite ? html`
                            <hb-button text-button label="Skip" @click=${this.skipFile}></hb-button>
                            <hb-button text-button label="Overwrite" @click=${this.overwriteFile}></hb-button>
                        ` : !state.isComplete ?  html`
                            <hb-button label="Stop" @click=${this.cancelUpload}></hb-button>
                        ` : state.skippedFiles.length > 0 && !this.viewSkipped ? html`
                            <hb-button text-button label="View Skipped" @click=${this.viewSkippedClicked}></hb-button>                        
                        ` : html``}
                    </div>
                </div>
            </div>
        `;
    }

    skipFile(event:Event) {
        const {requiresOverwriteFileIndex} = this.fileUploader.state;
        this.dispatchEvent(new OverwriteFileEvent(requiresOverwriteFileIndex, false));
    }

    overwriteFile(event:Event) {
        const {requiresOverwriteFileIndex} = this.fileUploader.state;
        this.dispatchEvent(new OverwriteFileEvent(requiresOverwriteFileIndex, true));
    }

    cancelUpload(event:Event) {
        this.dispatchEvent(new CancelUploadEvent());
    }

    viewSkippedClicked() {
        this.viewSkipped = true;
    }

    close() {
        this.open = false;
        FileUploadPanel.panel = null;
    }

    static styles = [styles.types, styles.icons, css`
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
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-file-upload-panel': FileUploadPanel
  }
}
