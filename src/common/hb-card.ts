import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";


/**
 * @class HorizontalCard
 * @fires "hb-card-click"
 */
@customElement('hb-card')
export class Card extends LitElement {

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
            <div class="card" @click=${this.handleClick}>
                <div class="media" ?hidden=${this.mediaUrl === ""}>
                    ${this.mediaHref ? html`
                        <a href=${this.mediaHref} draggable="false">
                            <div id="thumbnail" style="background-image: url(${this.mediaUrl})"></div>
                        </a>
                    ` : html`
                        <div id="thumbnail" style="background-image: url(${this.mediaUrl})"></div>
                    `}                    
                </div>
                <div class="text">
                    ${this.mediaHref ? html`
                        <a href=${this.mediaHref} draggable="false">
                            <div class="headline-small readable" title=${this.text}>${this.text}</div>
                        </a>
                    ` : html`
                        <div class="headline-small readable" title=${this.text}>${this.text}</div>
                    `}                    
                    <div class="body-large readable" title=${this.description}>${this.description}</div>
                </div>
                <slot></slot>        
            </div>
        `;
    }

    handleClick(event:Event) {
        this.dispatchEvent(new Event("hb-card-click", {bubbles: true, composed: false}));
    }

    static styles = [styles.icons, styles.types, css`
        :host {
            display: block;
        }
        .card {
            overflow: clip;
            display: flex;
            flex-direction: column;
            user-select: none;
            border-radius:  var(--md-sys-shape-corner-small);
            border: 1px solid transparent;
            cursor: default;
            gap: 5px;
            background-color: var(--md-sys-color-surface-variant);
            height: 100%;
        }
        .media,.media #thumbnail { 
            width: 100%;
            height: 168px;
            border-radius: 0 0 8px 8px;
        }
        .media #thumbnail {
            overflow: hidden;
            background-size: cover;
        }

        .text {
            flex-grow: 1;
            margin: 12px;
        }
        a {
            text-decoration: none;
        }
       .headline-small {
            margin-bottom: 8px;
       }
       .body-large {
            margin-bottom: 4px;
       }
        .readable {
            max-width: 35ch;
        }
        [hidden] {
            display: none;
        }   
    `]
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-card': Card
    }
}
