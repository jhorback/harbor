import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import "../common/hb-button";
import { FileType } from "../domain/interfaces/FileInterfaces";
import { FileSelectedEvent, FindFileDialog } from "../files/hb-find-file-dialog";
import { styles } from "../styles";
import { DocThumbChangeEvent, IDocDataState } from "./data/hb-doc-data";


/**  
 * 
 */
@customElement('hb-doc-thumb-settings-tab')
export class DocThumbSettingsTab extends LitElement {

    @property({type: Object})
    state!:IDocDataState;

    @state()
    selectedThumbIndex:number|null = null;

    @query("hb-find-file-dialog")
    $findFileDlg!:FindFileDialog;

    render() {
        const doc = this.state.doc;
        return html`
            <div class="container">
                <div class="thumb-ctr">
                    <div class="label-medium">Current thumb</div>
                    <div class="thumb" style="background-image: url(${doc.thumbUrl})"></div>
                </div>
                <div class="subtitle body-medium">
                    <div class="label-medium">Subtitle</div>
                    ${doc.subtitle}
                </div>
                <div class="thumbs-ctr">
                    <div class="label-medium">Available thumbs</div>
                    <div class="thumbs">
                        ${doc.thumbUrls.map((thumb, index) => html`
                            <div class="thumb-ctr" @click=${() => this.selectThumb(index)} thumb-index=${index}>
                                <div class="thumb" style="background-image: url(${thumb})"></div>
                                <img src=${thumb} @error=${() => this.onImageError(index)}>
                            </div>
                        `)}                       
                    </div>
                </div>                
                <div class="buttons">
                    ${this.selectedThumbIndex === null ? html`
                        <hb-button label="Find Image" text-button @click=${this.findThumb}></hb-button>
                    ` : html`
                        <hb-button label="Select" text-button @click=${this.setThumb}></hb-button>
                        <hb-button label="Remove" text-button @click=${this.removeThumb}></hb-button>
                    `}
                </div>
            </div>
            <hb-find-file-dialog
                file-type=${FileType.image}
                @file-selected=${this.fileSelected}
            ></hb-find-file-dialog>    
        `;
    }

    selectThumb(index: number) {
        this.shadowRoot?.querySelectorAll("[thumb-index]").forEach(el =>
            el.removeAttribute("selected"));
        if (index === this.selectedThumbIndex) {
            this.selectedThumbIndex = null;
        } else {
            this.shadowRoot?.querySelector(`[thumb-index="${index}"]`)?.setAttribute("selected", "");
            this.selectedThumbIndex = index;
        }
    }

    onImageError(index:number) {
        this.dispatchEvent(new DocThumbChangeEvent({removeIndex: index}));
    }

    findThumb() {
        this.$findFileDlg.open = true;
    }

    setThumb() {
        this.selectedThumbIndex !== null &&
            this.dispatchEvent(new DocThumbChangeEvent({setIndex: this.selectedThumbIndex}));
    }

    removeThumb() {
        this.selectedThumbIndex !== null &&
            this.dispatchEvent(new DocThumbChangeEvent({removeIndex: this.selectedThumbIndex}));
        this.selectedThumbIndex = null;
    }

    fileSelected(event:FileSelectedEvent) {
        this.dispatchEvent(new DocThumbChangeEvent({thumbs:[event.file.thumbUrl]}));
    }

    static styles = [styles.types, styles.dialog, css`
        :host {
            display: block;
        }
        .container {
            display: flex;
            gap: 12px;
        }
        .label-medium {
            margin-bottom: 8px;
            opacity: 0.7;
        }
        .container > .thumb-ctr, .subtitle { 
            padding: 5px 0;
        }
        .thumb-ctr, .thumb-ctr .thumb {             
            width: 100px;
            height: 100px;
            border-radius:  var(--md-sys-shape-corner-small);
        }
        .thumb-ctr, .thumb-ctr .thumb {
            overflow: hidden;
            background-size: cover;
        }
        .subtitle {
            max-width: 200px;
        }
        .thumbs-ctr {
            flex-grow: 1;
        }
        .thumbs {            
            max-height: 125px;
            overflow-y: auto;
            overflow-x: clip;
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            column-gap: 6px;
            row-gap: 6px;
        }
        .thumbs .thumb-ctr, .thumbs .thumb {
            width: 50px;
            height: 50px;
            border: 1px solid transparent;
        }
        .thumbs .thumb-ctr {
            opacity: 0.5;
        }
        .thumbs .thumb-ctr[selected] {
            opacity: 1;
            border: 1px solid var(--md-sys-color-primary);
        }
        .thumbs .thumb-ctr:hover {
            opacity: 1;
        }
        .thumbs img {
            visibility: hidden;
        }
        .buttons {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        hb-button {
            width: 120px;
        }
  `]
}



declare global {
  interface HTMLElementTagNameMap {
    'hb-doc-thumb-settings-tab': DocThumbSettingsTab
  }
}
