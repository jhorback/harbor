var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../common/hb-button";
import { styles } from "../../styles";
import { CloseFileViewerEvent, FileViewerController, NavigateFileViewerEvent, ShowFileViewerEvent } from "./FileViewerController";
/**
 */
let FileViewer = class FileViewer extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.showDetails = false;
        this.abortController = new AbortController();
        this.fileViewer = new FileViewerController(this);
    }
    getFileNameFromUrl() {
        const searchParams = new URLSearchParams(location.search);
        const fileName = searchParams.get("fileName");
        return fileName;
    }
    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this.keyClicked.bind(this), {
            signal: this.abortController.signal
        });
        window.addEventListener("popstate", () => {
            const fileName = this.getFileNameFromUrl();
            fileName ? this.show(fileName) : this.close();
        }, {
            signal: this.abortController.signal
        });
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.abortController.abort();
        this.abortController = new AbortController();
    }
    render() {
        const state = this.fileViewer.state;
        if (state.selectedFile === undefined) {
            return html ``;
        }
        const file = state.selectedFile.file;
        return html `
            <div class="file-viewer" ?details-panel=${this.showDetails}>
                <div class="content">
                    <div class="content-navigation">
                        <div class="toolbar">
                            <div
                                class="icon-button icon-medium"
                                @click=${this.close}
                            >arrow_back</div>
                            <div></div>
                            <div
                                class="icon-button icon-medium"
                                ?open=${this.showDetails}
                                @click=${this.detailsButtonClicked}
                            >menu_open</div>
                        </div>
                        <div class="icon-previous-ctr" @click=${this.previous} ?hide=${!state.canGoPrevious}>
                            <div class="icon-previous">
                                <div class="icon-button icon-large">
                                    chevron_left
                                </div>
                            </div>
                        </div> 
                        <div></div> 
                        <div class="icon-next-ctr" @click=${this.next} ?hide=${!state.canGoNext}>
                            <div class="icon-next">
                                <div class="icon-button icon-large">
                                    chevron_right
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div class="content-preview">
                        ${state.selectedFile.useMediaPreview ? html `                           

                            <video
                                poster=${file.pictureUrl}
                                controls="controls"
                                >
                                <source src=${file.url}>
                            </video>

                        ` : html `                        
                            <img src=${state.selectedFile.imagePreviewUrl}>                        
                        `}
                    </div> 
                </div>
                <div class="details-panel" ?hidden=${!this.showDetails}>
                    <div class="pad">
                        <div class="title-large">${file.name}</div>
                    </div>
                    <div class="pad">
                        <div class="body-large">Uploaded on ${file.updatedDate.toLocaleDateString()}</div>
                        ${!file.width ? html `` : html `
                            <div class="body-large">${file.width} x ${file.height}</div>                        
                        `}
                        <div class="body-large">${file.readableSize}</div>
                    </div>
                    <hr>

                    ${!file.mediaTags ? html `` : html `
                        <div class="pad">
                            <div class="title-medium">Media Tags</div>
                        </div>
                        ${!file.mediaTags.title ? html `` : html `
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.title} ${file.mediaTags.track ? html `(track ${file.mediaTags.track})` : html ``}</div>
                                <div class="body-medium">Title</div>
                            </div>
                        `}
                        ${!file.mediaTags.album ? html `` : html `
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.album} ${file.mediaTags.year ? html `(${file.mediaTags.year})` : html ``}</div>
                                <div class="body-medium">Album</div>
                            </div>
                        `}
                        ${!file.mediaTags.artist ? html `` : html `
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.artist}</div>
                                <div class="body-medium">Artist</div>
                            </div>
                        `}
                        ${!file.mediaTags.genre ? html `` : html `
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.genre}</div>
                                <div class="body-medium">Genre</div>
                            </div>
                        `}
                        <hr>
                    `}                    

                    <div class="buttons">
                        ${state.selectedFile.useMediaPreview ? html `
                            <hb-button label="Extract Picture File" text-button @click=${this.extractPicture}></hb-button>
                            <hb-button label="Set Picture File" text-button @click=${this.setPicture}></hb-button>
                        ` : html ``}                        
                        <hb-button label="Delete" text-button @click=${this.deleteFile}></hb-button>
                    </div>
                </div>
            </div>
        `;
    }
    updated() {
        window.scrollTo(0, 0);
        document.body.style.overflow = this.open ? "hidden" : "auto";
    }
    show(fileName) {
        this.fileName = fileName;
        this.open = true;
        this.dispatchEvent(new ShowFileViewerEvent());
    }
    close() {
        this.open = false;
        this.$video.pause();
        this.dispatchEvent(new CloseFileViewerEvent());
    }
    detailsButtonClicked() {
        this.showDetails = !this.showDetails;
    }
    keyClicked(event) {
        event.key === "ArrowRight" && this.next();
        event.key === "ArrowLeft" && this.previous();
        event.key === "Escape" && this.close();
    }
    previous() {
        this.fileViewer.state.canGoPrevious &&
            this.dispatchEvent(new NavigateFileViewerEvent(false));
    }
    next() {
        this.fileViewer.state.canGoNext &&
            this.dispatchEvent(new NavigateFileViewerEvent(true));
    }
    extractPicture() {
        alert("extract picture");
    }
    setPicture() {
        alert("set picture");
    }
    deleteFile() {
        alert("delete file");
    }
};
FileViewer.styles = [styles.types, styles.icons, css `
        :host {
            display: none;
            z-index:1;
            position: absolute;
            top: 0;
            right: 0;
            left: 0;
            bottom: 0;
            background-color: var(--md-sys-color-background);
        }
        :host([open]) {
            display: block;
        }
        [hide] {
            visibility: hidden;
        }

        .file-viewer {
            display: grid;
            height: 100%;
            grid-template-columns: 100% 0px;
        }
        .file-viewer[details-panel] {
            grid-template-columns: auto 340px;
        }
    
        
        .content {
            position: relative;
            height: 100%;
        }


        .content-preview {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
        }
        .content-preview img {
            max-width: 100vw;
            max-height: 100vh;
        }
        .file-viewer[details-panel] .content-preview img {
            max-width: calc(100vw - 340px);
        }
        .content-preview media-controller,
        .content-preview video {
            max-width: 100vw;
            min-width: 600px;
            max-height: 100vh;
        }
        media-control-bar {
            --media-control-background: rgba(20,20,30, 0.7);
            --media-control-background: transparent;
            --media-control-hover-background: transparent;
        }
        .file-viewer[details-panel] .content-preview media-controller,
        .file-viewer[details-panel] .content-preview video {
            max-width: calc(100vw - 340px);
        }
        .media-control-spacer {
            flex-grow:1;
            background: var(--media-control-background);
        }
        

        .content-navigation {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: grid;
            grid-template-rows: 66px calc(100vh - 66px);
            grid-template-columns: 1fr 2fr 1fr;
        }
        .toolbar {
            grid-column: span 3;
            display: grid;
            padding: 8px;
            grid-template-columns: 50px auto 50px;
            background-image: linear-gradient(0deg, rgba(0,0,0,0), rgba(0,0,0,.5))
        }
        .toolbar .icon-button {
            color: var(--md-sys-color-on-background);
        }
        .icon-button[open] {
            transform: scale(-1, 1);
        }
        .content-navigation .icon-previous-ctr:hover .icon-previous {
            display: block;
        }
        .content-navigation .icon-previous-ctr:hover .icon-button::before {
            background-color: var(--hb-sys-color-surface-tint4);
        }
        .content-navigation .icon-next-ctr:hover .icon-next {
            display: block;
        }
        .content-navigation .icon-next-ctr:hover .icon-button::before {
            background-color: var(--hb-sys-color-surface-tint4);
        }
        .icon-previous {
            display: none;
            position:absolute;
            top: calc(50% - 33px);
            left: 20px;
        }
        .icon-previous .icon-button {
            color: var(--md-sys-color-on-background);
        }
        .icon-next {
            display: none;
            position:absolute;
            top: calc(50% - 33px);
            right: 20px;
        }
        .icon-next .icon-button {
            color: var(--md-sys-color-on-background);
        }


        .details-panel {
            border-left: 1px solid var(--md-sys-color-outline);
            overflow-y: auto;
        }
        .pad {
            margin: 1rem;
        }
        hr {
            padding: 0;
            margin: 2rem 0;
            border-color: var(--md-sys-color-outline);
        }
        .buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
            text-align: center;
            padding: 1rem;
        }
  `];
__decorate([
    property({ type: Boolean, reflect: true })
], FileViewer.prototype, "open", void 0);
__decorate([
    property({ type: String, attribute: "file-name", reflect: true })
], FileViewer.prototype, "fileName", void 0);
__decorate([
    property({ type: Object, attribute: false })
], FileViewer.prototype, "files", void 0);
__decorate([
    property({ type: Boolean, attribute: "show-details" })
], FileViewer.prototype, "showDetails", void 0);
__decorate([
    query("video")
], FileViewer.prototype, "$video", void 0);
FileViewer = __decorate([
    customElement('hb-file-viewer')
], FileViewer);
export { FileViewer };
