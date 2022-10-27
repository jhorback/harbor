import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../../styles";
import { ImageContentDataState } from "../imageContentType";
import "../hb-content";
import { HbContent } from "../hb-content";


/**
 */
@customElement('hb-image-content')
export class ImageContent extends LitElement {
    static defaultState = new ImageContentDataState();

    @property({type:Number})
    contentIndex:number = -1;

    @property({type: Object})
    state:ImageContentDataState = ImageContent.defaultState;

    @state()
    inEditMode = false;

    @query("hb-content")
    $hbContent!:HbContent;

    @property({type:Boolean, attribute: "is-empty"})
    isEmpty = false;

    render() {
        return html`
            <hb-content ?is-empty=${!this.state.url}>                
                <div>
                    ${this.renderImage(this.state.url)}
                </div>
                <div slot="edit-toolbar">
                    <span
                        class="icon-button icon-small"
                        tab-index="0"
                        @click=${this.searchClicked}
                        title="Search for an image">
                        search
                    </span>
                    <span
                        class="icon-button icon-small"
                        tab-index="0"
                        @click=${this.uploadClicked}
                        title="Upload an image">
                        file_upload
                    </span>
                </div>
                <div slot="doc-edit-empty" @click=${this.clickedEmpty}>
                    ${this.renderImage("/content/thumbs/files-thumb.svg")}
                </div>
                <div slot="content-edit">
                    ${this.renderImage(this.state.url || "/content/thumbs/files-thumb.svg")}
                </div>
                <div slot="content-edit-tools">
                    IMAGE EDIT TOOLS<br>
                    And here are some<br>
                    Taller tools<br>
                    How does this display?
                </div>
            </hb-content>
        `;
    }

    private renderImage(src:string|null) {
        return !src ? html`` : html`
            <div size=${this.state.size} alignment=${this.state.alignment}>
                <img src=${src}>
            </div>
        `;
    }

    private clickedEmpty() {
        this.$hbContent.edit();
    }

    private searchClicked() {
        alert("Find image");
    }

    private uploadClicked() {
        alert("Upload image");
    }

    static styles = [styles.icons, css`
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
        div[slot="content-edit-tools"] {
            padding: 8px;
        }
  `]
}


declare global {
    interface HTMLElementTagNameMap {
        'hb-image-content': ImageContent
    }
}
