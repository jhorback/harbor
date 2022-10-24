var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
import { CancelUploadEvent, FileUploadStatusData, OverwriteFileEvent } from "./FileUploaderClient";
import "../common/hb-button";
/**
 */
let UploadStatusPanel = class UploadStatusPanel extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.state = new FileUploadStatusData();
        this.viewSkipped = false;
    }
    /**
     * Helper method to create and open the panel.
     * It is responsible for closing and removing itself.
     */
    static open() {
        const el = document.createElement("hb-upload-status-panel");
        document.body.appendChild(el);
        setTimeout(() => el.setAttribute("open", ""));
        return el;
    }
    render() {
        if (this.state.isComplete && this.state.skippedFiles.length === 0) {
            setTimeout(this.close.bind(this), 2000);
        }
        return html `
            <div class="container">
                ${!this.state.isComplete ? html `
                    <div class="image-container">
                        ${this.state.highlightFileSrc ? html `
                            <img src=${this.state.highlightFileSrc}>                    
                        ` : html ``}
                    </div>
                ` : this.state.skippedFiles.length > 0 ? html `
                    <div class="warning-container">
                        <span class="material-symbols-outlined icon-small">warning</span>
                    </div>
                ` : html ``}                
                <div class="text-container">
                    <div class="msg-container">
                        <div class="text">
                            ${this.state.requiresOverwrite ? html `
                                <div class="body-small quiet">File already exists</div>
                                <div class="title-medium">Overwrite file?</div>
                                <div class="body-small">${this.state.requiresOverwriteFileName}</div>
                            ` : !this.state.isComplete ? html `
                                <div class="body-small empty"></div>
                                <div class="title-medium">Uploading ${this.state.uploadFileTypes}</div>
                                <div class="body-small quiet">${this.state.percentComplete}% complete</div>
                            ` : html `
                                <div class="done-container">
                                    <div class="title-medium">
                                        ${this.state.skippedFiles.length > 0 ? html `
                                            Can't upload ${this.state.skippedFiles.length} items
                                        ` : html `
                                            Finished uploading files
                                        `}                                        
                                    </div>
                                    <div class="body-small of-uploads">
                                        ${this.state.skippedFiles.length > 0 && !this.viewSkipped ? html `
                                            Out of ${this.state.ofFile} uploads
                                        ` : this.state.skippedFiles.length > 0 ? html `
                                            ${this.state.skippedFiles.map(file => html `
                                                <div class="body-medium skipped">
                                                    <span class="material-symbols-outlined icon-small">draft</span>
                                                    <span>${file}</span>
                                                </div>
                                            `)}
                                        ` : html `
                                            ${this.state.ofFile} uploads
                                        `}
                                    </div>
                                </div>                                
                            `}
                        </div>
                        ${this.state.isComplete ? html `
                            <div class="icon"><span class="icon-button icon-small" @click=${this.close}>close</span></div>
                        ` : html ``}
                    </div>
                    <div class="buttons">
                        ${this.state.requiresOverwrite ? html `
                            <hb-button text-button label="Skip" @click=${this.skipFile}></hb-button>
                            <hb-button text-button label="Overwrite" @click=${this.overwriteFile}></hb-button>
                        ` : !this.state.isComplete ? html `
                            <hb-button label="Stop" @click=${this.cancelUpload}></hb-button>
                        ` : this.state.skippedFiles.length > 0 && !this.viewSkipped ? html `
                            <hb-button text-button label="View Skipped" @click=${this.viewSkippedClicked}></hb-button>                        
                        ` : html ``}
                    </div>
                </div>
            </div>
        `;
    }
    skipFile(event) {
        this.dispatchEvent(new OverwriteFileEvent(this.state.requiresOverwriteFileIndex, false));
    }
    overwriteFile(event) {
        this.dispatchEvent(new OverwriteFileEvent(this.state.requiresOverwriteFileIndex, true));
    }
    cancelUpload(event) {
        this.dispatchEvent(new CancelUploadEvent());
    }
    viewSkippedClicked() {
        this.viewSkipped = true;
    }
    close() {
        this.open = false;
        setTimeout(() => {
            this.parentElement?.removeChild(this);
        }, 1000);
    }
    static { this.styles = [styles.types, styles.icons, css `
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
        .image-container, .image-container img {
            background-color: #d9d9d9;
            border-radius: 8px 0 0 8px;
            width: 100px;
            height: 100px;
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
    `]; }
};
__decorate([
    property({ type: Boolean, reflect: true })
], UploadStatusPanel.prototype, "open", void 0);
__decorate([
    property({ type: Object })
], UploadStatusPanel.prototype, "state", void 0);
__decorate([
    property({ type: Boolean, attribute: "view-skipped", reflect: true })
], UploadStatusPanel.prototype, "viewSkipped", void 0);
UploadStatusPanel = __decorate([
    customElement('hb-upload-status-panel')
], UploadStatusPanel);
export { UploadStatusPanel };
