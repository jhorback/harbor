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
        let mediaUrl = "";
        mediaUrl = "https://lh3.googleusercontent.com/TtLzAQtE1mJwSJnnBxddJ8iXnbasIOQ0_VyypdFaT0shpKTwGDgsNTJF-qSoDMuBb0pHU-Wxj7Gj5fMe1QO6k7Hfu1nXFgDuB9DVIKexQIHKdN0N9mKWL9BXHdZU_mgyqn6F3Qm1-DDmNJVHr0oMoNlX3xwRDfLLztcvuv9VKB7alQR-D4tciR0qHK25H-nMBncCyJ-GMf2CTs3vk94YxHynkqZJwwLutvEgKGjr4qqhCsft4sA5z52zxOLapUT2WKPdIHOYzFlie-nYpse64pqSNWUH6dWXopWf4DThPgm-NlKW-UrtUuF6fPc6_OdsORLP602oKIXIllB879DroX57a8e8z8Tj0y0Zzqn0oHQlCNiuSihSM6xa-Lg381I1JnvLQ38ooDmePs7L9WTUxtVxcDaetPmGBzoq18Ki8NwbnxE4pY2hmQZVXFCae1rc3YLs-uMC4U8-NDn-6tv_OxsMjSy2ZIz1KKkJintXq8nWZgjBwJCM0gYy2wthjFl4UdSFzrBzO5bOXXLOsP5XEPq6cqdy90OXq0UDyTVdlsPnFEoBuPPdZ14h90ongaTq5fRXLAbmlvqQaU50aKzFXe5AY8vUKs4O64gYsMic3ZwIjdq3StegPE28gWaBEHY1aQUkn0MHPkaJx1ANuLGPDID6CjaJd2uIAl1dE1btjsMKBjJ98FIsx9c0AT4cU4wOVNmio7TqQ4TwdiFwwrdA-uyCrmcKTEd6YyvG5OKXBgchwDHYOxSeQL2hPSZeWvu8F1l2zL81xJYFdvn8CJmCNYMPqyi5ls8gQUs3zRDU_wPx1YanVzP0cGXrqyTj50ItY9RC2Fe-3nYBzIGT_MPqZ_3LuW8wRGGqFIIz6fsq1OnHyDe2CImiHgAHQmrUrsHBuSUlwD2SUG-1EVifed6T8RhQa5KkoRv_sH1UXabg4eppwlaC7A=w2253-h1268-no?authuser=0";
        // mediaUrl = "/content/thumbs/audio-thumb.svg";
        // mediaUrl = "https://photos.google.com/photo/AF1QipNg1srcdLxX9Cp-e_DgaawJZgLOXpgITrCbDqGU";
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
                        <div class="icon-previous-ctr" @click=${this.previous}>
                            <div class="icon-previous">
                                <div class="icon-button icon-large">
                                    chevron_left
                                </div>
                            </div>
                        </div> 
                        <div></div> 
                        <div class="icon-next-ctr" @click=${this.next}>
                            <div class="icon-next">
                                <div class="icon-button icon-large">
                                    chevron_right
                                </div>
                            </div>
                        </div> 
                    </div>
                    <div class="content-image">
                        <img src=${mediaUrl}>
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
        window.scrollTo(0, 0);
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
    
        
        .content {
            position: relative;
            height: 100%;
        }


        .content-image {
            display: flex;
            height: 100%;
            justify-content: center;
            align-items: center;
        }
        .content-image img {
            max-width: 100vw;
            max-height: 100vh;
        }
        .file-viewer[details-panel] .content-image img {
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
