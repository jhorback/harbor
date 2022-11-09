import { css, html, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "../styles";
import { DocThumbChangeEvent, IDocDataState } from "./data/hb-doc-data";
import "../common/hb-button";


/**  
 * 
 */
@customElement('hb-doc-thumb-settings-tab')
export class DocThumbSettingsTab extends LitElement {

    @property({type: Object})
    state!:IDocDataState;

    @state()
    selectedThumbIndex:number|null = null;

    render() {
        const doc = this.state.doc;
        return html`
            <div class="container">
                <div class="thumb-ctr">
                    <div class="thumb" style="background-image: url(${doc.thumbUrl})"></div>
                </div>
                <div class="subtitle">
                    ${doc.subtitle}
                </div>
                <div class="thumbs">
                    ${doc.thumbUrls.map((thumb, index) => html`
                        <div class="thumb-ctr" @click=${() => this.selectThumb(index)} thumb-index=${index}>
                            <div class="thumb" style="background-image: url(${thumb})"></div>
                            <img src=${thumb} @error=${() => this.onImageError(index)}>
                        </div>
                    `)}
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
        this.dispatchEvent(new DocThumbChangeEvent({thumbs:["https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885__480.jpg"]}));
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

    static styles = [styles.types, styles.dialog, css`
        :host {
            display: block;
        }
        .container {
            display: flex;
            gap: 12px;
        }
        .container > .thumb-ctr, .subtitle { 
            padding: 5px 0;
        }
        .thumb-ctr, .thumb-ctr .thumb {             
            width: 80px;
            height: 80px;
            border-radius:  var(--md-sys-shape-corner-small);
        }
        .thumb-ctr, .thumb-ctr .thumb {
            overflow: hidden;
            background-size: cover;
        }
        .subtitle {
            max-width: 200px;
        }
        .thumbs {
            flex-grow: 1;
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
