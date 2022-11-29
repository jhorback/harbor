import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
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

    @property({type: Boolean, attribute: "detail-pane"})
    detailPane:boolean = false;

    render() {
        
        return html`
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

    show(fileName:string) {
        this.fileName = fileName;
        this.open = true;
    }

    close() {
       this.open = false;
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
  `]
}



declare global {
  interface HTMLElementTagNameMap {
    'hb-file-viewer': FileViewer
  }
}
