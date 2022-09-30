import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";



/**
 * @class HorizontalCard
 */
@customElement('hb-horizontal-card')
export class HorizontalCard extends LitElement {

    @property({type: String, attribute: "media-url"})
    mediaUrl = "";

    @property({type: String, attribute: "media-href"})
    mediaHref = "";

    @property({type: String})
    text = "";

    @property({type: String})
    description = "";


    render() {
        return html`
            <div class="horizontal-card" @click=${this.handleClick}>
                <div class="text">
                    <div class="title-medium readable">${this.text}</div>
                    <div class="body-medium readable">${this.description}</div>
                </div>
                <div class="media" ?hidden=${this.mediaUrl === ""}>
                    <a href=${this.mediaHref}>
                        <img src=${this.mediaUrl} @error=${this.onImageError}>
                    </a>
                </div>
            </div>
        `;
    }

    handleClick(event:Event) {
        this.dispatchEvent(new Event("hb-horizontal-card-click", {bubbles: true, composed: false}));
    }

    private onImageError(event:Event) {
        console.log(`hb-avatar image failed to load, falling back to use an icon`);
        this.mediaUrl = "";
      }

    static styles = [styles.icons, styles.types, css`
        :host {
            display: block;
        }
        .horizontal-card {
            display: flex;
            user-select: none;
            border: 1px solid transparent;
            border-radius:  var(--md-sys-shape-corner-small);
            padding: 0 0 0 10px;
            align-items: center;
            cursor: default;
            gap: 5px;
            background-color: var(--md-sys-color-surface-variant);
        }
        .text {
            flex-grow: 1;
        }
        .title-medium {
            line-height: 2rem;
        }
        .readable {
            max-width: 35ch;
        }
        [hidden] {
            display: none;
        }
        .media { 
            width: 80px;
            height: 80px;
        }
        .media img {
            width: 80px;
            height: 80px;
            vertical-align: middle;
            display: inline-block;
            border-radius:  0 8px 8px 0;
        }
    `]
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-horizontal-card': HorizontalCard
    }
}
