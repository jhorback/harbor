import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import "../common/hb-button";
import { FileModel } from "../domain/Files/FileModel";
import { styles } from "../styles";



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

    connectedCallback() {
        super.connectedCallback();
        document.addEventListener("keydown", this.keyClicked.bind(this), {
            signal: this.abortController.signal
        } as AddEventListenerOptions);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.abortController.abort();
        this.abortController = new AbortController();
    }

    render() {
        
        return html`
            <div class="file-viewer" ?details-panel=${this.showDetails}>
                <div class="content-pane">
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
                    <div class="content">
                        <div class="content-navigation">
                            <div @click=${this.previous}>
                                <div class="icon-previous">
                                    <div class="icon-button icon-large">
                                        chevron_left
                                    </div>
                                </div>
                            </div> 
                            <div></div> 
                            <div @click=${this.next}>
                                <div class="icon-next">
                                    <div class="icon-button icon-large">
                                        chevron_right
                                    </div>
                                </div>
                            </div> 
                        </div>
                        <div class="content-image">
                            ${this.fileName} = ${this.files.length}
                            <br>
                            details open? ${this.showDetails}
                        </div>
                    </div>
                </div>
                <div class="details-panel" ?hidden=${!this.showDetails}>
                    <div class="pad">
                        <div class="title-large">Bacchus - Into Me.mp3</div>
                    </div>
                    <div class="pad">
                        <div class="body-large">Uploaded on 11/29/2022</div>
                        <div class="body-large">1200 x 600</div>
                        <div class="body-large">2.3 MB</div>
                    </div>                    
                    <hr>
                    <div class="pad">
                        <div class="title-medium">Media Tags</div>
                    </div>
                    <div class="pad">
                        <div class="body-large">Into Me (track 1)</div>
                        <div class="body-medium">Title</div>
                    </div>
                    <div class="pad">
                        <div class="body-large">A Bacchus Christmas (1999)</div>
                        <div class="body-medium">Album</div>
                    </div>
                    <div class="pad">
                        <div class="body-large">Bacchus</div>
                        <div class="body-medium">Artist</div>
                    </div>
                    <div class="pad">
                        <div class="body-large">Original</div>
                        <div class="body-medium">Genre</div>
                    </div>
                    <hr>

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
        document.body.style.overflow = this.open ? "hidden" : "auto";
    }

    show(fileName:string) {
        this.fileName = fileName;
        this.open = true;
    }

    close() {
       this.open = false;
    }

    private detailsButtonClicked() {
        this.showDetails = !this.showDetails;
    }

    private keyClicked(event:KeyboardEvent) {
       event.key === "ArrowRight" && this.next();
       event.key === "ArrowLeft" && this.previous();
    }
    
    private previous() {
        alert("previous");
    }

    private next() {
        alert("next");
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

        .file-viewer {
            display: grid;
            height: 100%;
            grid-template-columns: 100% 0px;
        }
        .file-viewer[details-panel] {
            grid-template-columns: auto 340px;
        }
        .content-pane {
            display: grid;
            grid-template-columns: 100%;
            grid-template-rows: 66px auto;
        }
        .toolbar {
            display: grid;
            padding: 8px;
            grid-template-columns: 50px auto 50px;
        }
        .icon-button[open] {
            transform: scale(-1, 1);
        }
        .content {
            position: relative;
            height: 100%;
        }
        .content-navigation {
            position: absolute;
            top: 0;
            right: 0;
            bottom: 0;
            left: 0;
            display: grid;
            grid-template-columns: 1fr 2fr 1fr;
        }
        .content-navigation > :first-child:hover .icon-previous {
            display: block;
        }
        .content-navigation > :last-child:hover .icon-next {
            display: block;
        }
        .icon-previous {
            display: none;
            position:absolute;
            top: calc(50% - 25px);
            left: 20px;
        }
        .icon-next {
            display: none;
            position:absolute;
            top: calc(50% - 25px);
            right: 20px;
        }




        .details-panel {
            border-left: 1px solid var(--md-sys-color-outline);
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
        xxx-hb-button {
            max-width: 200px;
            margin: auto;
        }
        
  `]
}



declare global {
  interface HTMLElementTagNameMap {
    'hb-file-viewer': FileViewer
  }
}
