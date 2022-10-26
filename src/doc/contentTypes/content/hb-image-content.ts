import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "../../../styles";
import { ImageContentDataState } from "../imageContentType";
import "../hb-content";


/**
 */
@customElement('hb-image-content')
export class ImageContent extends LitElement {
    static defaultState = new ImageContentDataState();

    @property({type:Number})
    index:number = -1;

    @property({type: Object})
    state:ImageContentDataState = ImageContent.defaultState;

    @state()
    inEditMode = false;

    render() {
        return html`
            <hb-content ?is-empty=${!this.state.url}>                
                <div>
                    ${this.renderImage(this.state.url)}
                </div>
                <div slot="edit-toolbar">
                    IMAGE EDIT TOOLBAR
                </div>
                <div slot="doc-edit-empty">
                    ${this.renderImage("/content/thumbs/files-thumb.svg")}
                </div>
                <div slot="content-edit">
                    ${this.renderImage(this.state.url || "/content/thumbs/files-thumb.svg")}
                    CONTENT EDIT MODE
                </div>
            </hb-content>
        `;
    }

    renderImage(src:string|null) {
        return src === null ? html`` : html`
            <div size=${this.state.size} alignment=${this.state.alignment}>
                <img src=${src}>
            </div>
        `;
    }

    static styles = [css`
        :host {
            display: block;
            position: relative;
        }
        div[size=small] img {
            width: 100px;
        }
        div[size=medium] img {
            width: 300px;
        }
        div[size=large] img {
            width: 600px;
            max-width: 100%;
        }
        div[alignment=left] {
            text-align: left;
        }
        div[alignment=center] {
            text-align: center;
        }
        div[alignment=right] {
            text-align: right;
        }
  `]
}


declare global {
    interface HTMLElementTagNameMap {
        'hb-image-content': ImageContent
    }
}
