import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../common/hb-button";
import { FileModel } from "../../domain/Files/FileModel";
import { FileType } from "../../domain/interfaces/FileInterfaces";
import { styles } from "../../styles";
import { FileDeletedEvent } from "../hb-delete-file-dialog/DeleteFileController";
import "../hb-delete-file-dialog/hb-delete-file-dialog";
import { DeleteFileDialog } from "../hb-delete-file-dialog/hb-delete-file-dialog";
import { FileSelectedEvent, FindFileDialog } from "../hb-find-file-dialog";
import { CloseFileViewerEvent, ExtractMediaPosterEvent, FileViewerController, NavigateFileViewerEvent, ShowFileViewerEvent, UpdateMediaPosterEvent } from "./FileViewerController";

/**  
 */
@customElement('hb-file-viewer')
export class FileViewer extends LitElement {

    @property({type: Boolean, reflect: true})
    open:boolean = false;

    @property({type: String, attribute: "file-name", reflect: true})
    fileName!:string;

    @property({type: Object, attribute: false})
    files!:Array<FileModel>;

    @property({type: Boolean, attribute: "show-details"})
    showDetails:boolean = false;

    private abortController:AbortController = new AbortController();

    private fileViewer:FileViewerController = new FileViewerController(this);

    @query("video")
    private $video:HTMLVideoElement|undefined;

    @query("hb-find-file-dialog")
    $findFileDlg!:FindFileDialog;

    @query("hb-delete-file-dialog")
    $deleteFileDlg!:DeleteFileDialog;

    getFileNameFromUrl():string|null {
        const searchParams = new URLSearchParams(location.search);
        const fileName = searchParams.get("fileName");
        return fileName;    
    }

    connectedCallback() {
        super.connectedCallback();
        
        document.addEventListener("keydown", this.keyClicked.bind(this), {
            signal: this.abortController.signal
        } as AddEventListenerOptions);

        window.addEventListener("popstate", () => {
            const fileName = this.getFileNameFromUrl();
            fileName ? this.show(fileName) : this.close();
        }, {
            signal: this.abortController.signal
        } as AddEventListenerOptions);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.abortController.abort();
        this.abortController = new AbortController();
    }

    render() {
        const state = this.fileViewer.state;
        if (state.selectedFile === undefined) {
            return html``;
        }
        const file = state.selectedFile.file;


        return html`
            <hb-find-file-dialog
                file-type=${FileType.image}
                @file-selected=${this.fileSelected}
            ></hb-find-file-dialog>
            <hb-delete-file-dialog
                file-name=${file.name}
                @file-deleted=${this.fileDeleted}
            ></hb-delete-file-dialog>
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
                        ${state.selectedFile.useMediaPreview ? html`                           

                            <video
                                poster=${file.mediaPosterUrl}
                                controls="controls"
                                >
                                <source src=${file.url}>
                            </video>

                        ` : html`                        
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
                        <div class="body-large">
                            ${file.readableSize} ·
                            <a href="${file.url}" target="file">(download)</a>
                        </div>
                        ${!file.width ? html `` :  html`
                            <div class="body-large">${file.width} x ${file.height}</div>                        
                        `}
                    </div>
                    <hr>

                    ${!file.mediaTags ? html`` : html`
                        <div class="pad">
                            <div class="title-medium">Media Tags</div>
                        </div>
                        ${!file.mediaTags.title ? html`` : html`
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.title} ${file.mediaTags.track ? html`(track ${file.mediaTags.track})` : html``}</div>
                                <div class="body-medium">Title</div>
                            </div>
                        `}
                        ${!file.mediaTags.album ? html`` : html`
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.album} ${file.mediaTags.year ? html`(${file.mediaTags.year})` : html``}</div>
                                <div class="body-medium">Album</div>
                            </div>
                        `}
                        ${!file.mediaTags.artist ? html`` : html`
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.artist}</div>
                                <div class="body-medium">Artist</div>
                            </div>
                        `}
                        ${!file.mediaTags.genre ? html`` : html`
                            <div class="pad">
                                <div class="body-large">${file.mediaTags.genre}</div>
                                <div class="body-medium">Genre</div>
                            </div>
                        `}
                        <hr>
                    `}                    

                    <div class="buttons">
                        ${state.selectedFile.canExtractMediaPoster ? html`
                            <hb-button label="Extract Media Poster" text-button @click=${this.extractMediaPoster}></hb-button>                        
                        ` : html``}
                        ${state.selectedFile.canSetMediaPoster ? html`
                            <hb-button label="Set Media Poster" text-button @click=${this.setMediaPoster}></hb-button>
                        ` : html`` }
                        <hb-button label="Delete File" text-button @click=${this.deleteFile}></hb-button>
                    </div>
                </div>
            </div>
        `;
    }

    updated() {
        window.scrollTo(0, 0);
        document.body.style.overflow = this.open ? "hidden" : "auto";
    }

    show(fileName:string) {
        this.fileName = fileName;
        this.open = true;
        this.dispatchEvent(new ShowFileViewerEvent());
    }

    close() {
       this.open = false;
       this.$video && this.$video.pause();
       this.dispatchEvent(new CloseFileViewerEvent());
    }

    private detailsButtonClicked() {
        this.showDetails = !this.showDetails;
    }

    private keyClicked(event:KeyboardEvent) {
       event.key === "ArrowRight" && this.next();
       event.key === "ArrowLeft" && this.previous();
       event.key === "Escape" && this.close();
    }
    
    private previous() {
        this.fileViewer.state.canGoPrevious && 
            this.dispatchEvent(new NavigateFileViewerEvent(false));
    }

    private next() {
        this.fileViewer.state.canGoNext && 
            this.dispatchEvent(new NavigateFileViewerEvent(true));
    }

    private extractMediaPoster() {
        this.dispatchEvent(new ExtractMediaPosterEvent());
    }

    private setMediaPoster() {
        this.$findFileDlg.open = true;
    }

    private fileSelected(event:FileSelectedEvent) {
        this.dispatchEvent(new UpdateMediaPosterEvent(event.file));
    }

    private deleteFile() {
        this.$deleteFileDlg.showModal();
    }

    private fileDeleted() {
        this.$deleteFileDlg.close();
        this.dispatchEvent(new FileDeletedEvent());
    }

    static styles = [styles.types, styles.icons, css`
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
            padding: 0 1rem 1rem 1rem;
        }
  `]
}

/*
 <!-- <media-controller>
        <video
            slot="media"
            src=${file.url}
            poster=${file.pictureUrl}
        ></video>
        <media-control-bar>
            <media-time-range></media-time-range>
        </media-control-bar>                               
        <media-control-bar>
            <media-play-button></media-play-button>
            <media-seek-forward-button seek-offset="10"></media-seek-forward-button>
            <media-seek-backward-button seek-offset="10"></media-seek-backward-button>
            <media-mute-button></media-mute-button>
            <media-volume-range></media-volume-range>
            <span class="media-control-spacer"></span>
            <media-time-display show-duration></media-time-display>
            <media-fullscreen-button></media-fullscreen-button>
        </media-control-bar>
    </media-controller> -->
*/


declare global {
  interface HTMLElementTagNameMap {
    'hb-file-viewer': FileViewer
  }
}
