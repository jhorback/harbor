var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import "../common/hb-button";
import { styles } from "../styles";
/**
 */
let FileViewer = class FileViewer extends LitElement {
    constructor() {
        super(...arguments);
        this.open = false;
        this.detailPane = false;
    }
    render() {
        return html `
            <div class="toolbar">
                <span
                    class="icon-button"
                    @click=${this.close}
                >arrow_back</span>
            </div>
            <div>
                ${this.fileName} = ${this.files.length}
            </div>
        `;
    }
    show(fileName) {
        this.fileName = fileName;
        this.open = true;
    }
    close() {
        this.open = false;
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
    property({ type: Boolean, attribute: "detail-pane" })
], FileViewer.prototype, "detailPane", void 0);
FileViewer = __decorate([
    customElement('hb-file-viewer')
], FileViewer);
export { FileViewer };
