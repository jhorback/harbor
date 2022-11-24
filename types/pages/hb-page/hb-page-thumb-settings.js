var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { FileType } from "../../domain/interfaces/FileInterfaces";
import { styles } from "../../styles";
import "../../common/hb-button";
import { PageThumbChangeEvent } from "./PageController";
/**
 *
 */
let PageThumbSettingsTab = class PageThumbSettingsTab extends LitElement {
    constructor() {
        super(...arguments);
        this.selectedThumbIndex = null;
    }
    render() {
        const page = this.state.page;
        return html `
            <div class="container">
                <div class="thumb-ctr">
                    <div class="label-medium">Current thumb</div>
                    <div class="thumb" style="background-image: url(${page.thumbUrl})"></div>
                </div>
                <div class="subtitle body-medium">
                    <div class="label-medium">Subtitle</div>
                    ${page.subtitle}
                </div>
                <div class="thumbs-ctr thumbs-grid">
                    <div class="label-medium">Available thumbs</div>
                    <div class="thumbs">
                        ${page.thumbUrls.map((thumb, index) => html `
                            <div class="thumb-ctr" @click=${() => this.selectThumb(index)} thumb-index=${index}>
                                <div class="thumb" style="background-image: url(${thumb})"></div>
                                <img src=${thumb} @error=${() => this.onImageError(index)}>
                            </div>
                        `)}                       
                    </div>
                </div>                
                <div class="buttons">
                    ${this.selectedThumbIndex === null ? html `
                        <hb-button label="Find Image" text-button @click=${this.findThumb}></hb-button>
                    ` : html `
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
    selectThumb(index) {
        this.shadowRoot?.querySelectorAll("[thumb-index]").forEach(el => el.removeAttribute("selected"));
        if (index === this.selectedThumbIndex) {
            this.selectedThumbIndex = null;
        }
        else {
            this.shadowRoot?.querySelector(`[thumb-index="${index}"]`)?.setAttribute("selected", "");
            this.selectedThumbIndex = index;
        }
    }
    onImageError(index) {
        this.dispatchEvent(new PageThumbChangeEvent({ removeIndex: index }));
    }
    findThumb() {
        this.$findFileDlg.open = true;
    }
    setThumb() {
        this.selectedThumbIndex !== null &&
            this.dispatchEvent(new PageThumbChangeEvent({ setIndex: this.selectedThumbIndex }));
    }
    removeThumb() {
        this.selectedThumbIndex !== null &&
            this.dispatchEvent(new PageThumbChangeEvent({ removeIndex: this.selectedThumbIndex }));
        this.selectedThumbIndex = null;
    }
    fileSelected(event) {
        this.dispatchEvent(new PageThumbChangeEvent({ thumbs: [event.file.thumbUrl] }));
    }
};
PageThumbSettingsTab.styles = [styles.types, styles.dialog, css `
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
        .thumbs-grid {
            padding-top: 5px;
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
            gap: 6px;
            grid-template-columns: repeat(auto-fill, 50px);
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
  `];
__decorate([
    property({ type: Object })
], PageThumbSettingsTab.prototype, "state", void 0);
__decorate([
    state()
], PageThumbSettingsTab.prototype, "selectedThumbIndex", void 0);
__decorate([
    query("hb-find-file-dialog")
], PageThumbSettingsTab.prototype, "$findFileDlg", void 0);
PageThumbSettingsTab = __decorate([
    customElement('hb-page-thumb-settings-tab')
], PageThumbSettingsTab);
export { PageThumbSettingsTab };
