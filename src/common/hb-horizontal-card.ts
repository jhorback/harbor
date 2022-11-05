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

    @property({type: String, attribute: "link-target"})
    linkTarget = "";

    @property({type: String})
    text = "";

    @property({type: String})
    description = "";

    @property({type: Boolean})
    selected = false; // jch - storybook

    render() {
        return html`
            <div class="horizontal-card" @click=${this.handleClick} ?selected=${this.selected}>
                <div class="text">
                    ${this.mediaHref ? html`
                        <a href=${this.mediaHref} target=${this.linkTarget}>
                            <div class="title-medium readable" title=${this.text}>${this.text}</div>
                        </a>
                    ` : html`
                        <div class="title-medium readable" title=${this.text}>${this.text}</div>
                    `}                    
                    <div class="body-medium readable" title=${this.description}>${this.description}</div>
                </div>
                <div class="media" ?hidden=${this.mediaUrl === ""}>
                    ${this.mediaHref ? html`
                        <a href=${this.mediaHref} target=${this.linkTarget}>
                            <img src=${this.mediaUrl} @error=${this.onImageError}>
                        </a>
                    ` : html`
                        <img src=${this.mediaUrl} @error=${this.onImageError}>
                    `}                    
                </div>
            </div>
        `;
    }

    handleClick(event:Event) {
        // jch - make sure storybook shows this event
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
            overflow: clip;
            display: flex;
            user-select: none;
            border-radius:  var(--md-sys-shape-corner-small);
            border: 1px solid transparent;
            padding: 0 0 0 10px;
            align-items: center;
            cursor: default;
            gap: 5px;
            background-color: var(--md-sys-color-surface-variant);
        }
        .horizontal-card[selected] {
            border: 1px solid var(--md-sys-color-on-background);
            background-color: var(--md-sys-color-background);
        }
        .text {
            flex-grow: 1;
        }
        a {
            text-decoration: none;

        }
        .title-medium {
            max-height: 2.5rem;
            overflow: clip;
        }
        .body-medium {
            max-height: 34px;
            overflow: clip;
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
