import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../../common/hb-button";
import { FileModel } from "../../domain/Files/FileModel";
import { styles } from "../../styles";
import { CloseFileViewerEvent, FileViewerController, NavigateFileViewerEvent, ShowFileViewerEvent } from "./FileViewerController";



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

                        <img src=${state.selectedFile.imagePreviewUrl}>                        

                    </div> 
                </div>
                <div class="details-panel" ?hidden=${!this.showDetails}>
                    <div class="pad">
                        <div class="title-large">${file.name}</div>
                    </div>
                    <div class="pad">
                        <div class="body-large">Uploaded on ${file.updatedDate.toLocaleDateString()}</div>
                        ${!file.width ? html `` :  html`
                            <div class="body-large">${file.width} x ${file.height}</div>                        
                        `}
                        <div class="body-large">${file.readableSize}</div>
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
                        <hb-button label="View Picture File" text-button @click=${this.viewPicture}></hb-button>
                        <hb-button label="Extract Picture File" text-button @click=${this.extractPicture}></hb-button>
                        <hb-button label="Set Picture File" text-button @click=${this.setPicture}></hb-button>
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

    show(fileName:string) {
        this.fileName = fileName;
        this.open = true;
        this.dispatchEvent(new ShowFileViewerEvent());
    }

    close() {
       this.open = false;
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

    private viewPicture() {
        alert("view picture");
    }

    private extractPicture() {
        alert("extract picture");
    }

    private setPicture() {
        alert("set picture");
    }

    private deleteFile() {
        alert("delete file");
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
  `]
}



declare global {
  interface HTMLElementTagNameMap {
    'hb-file-viewer': FileViewer
  }
}
