var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
/**
 * @class HorizontalCard
 * @fires "hb-card-click"
 */
let Card = class Card extends LitElement {
    constructor() {
        super(...arguments);
        this.mediaUrl = "";
        this.mediaHref = "";
        this.text = "";
        this.description = "";
    }
    render() {
        return html `
            <div class="card" @click=${this.handleClick}>
                <div class="media" ?hidden=${this.mediaUrl === ""}>
                    ${this.mediaHref ? html `
                        <a href=${this.mediaHref} draggable="false">
                            <div id="thumbnail" style="background-image: url(${this.mediaUrl})"></div>
                        </a>
                    ` : html `
                        <div id="thumbnail" style="background-image: url(${this.mediaUrl})"></div>
                    `}                    
                </div>
                <div class="text">
                    ${this.mediaHref ? html `
                        <a href=${this.mediaHref} draggable="false">
                            <div class="headline-small readable" title=${this.text}>${this.text}</div>
                        </a>
                    ` : html `
                        <div class="headline-small readable" title=${this.text}>${this.text}</div>
                    `}                    
                    <div class="body-large readable" title=${this.description}>${this.description}</div>
                </div>
                <slot></slot>        
            </div>
        `;
    }
    handleClick(event) {
        this.dispatchEvent(new Event("hb-card-click", { bubbles: true, composed: false }));
    }
};
Card.styles = [styles.icons, styles.types, css `
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
    `];
__decorate([
    property({ type: String, attribute: "media-url" })
], Card.prototype, "mediaUrl", void 0);
__decorate([
    property({ type: String, attribute: "media-href" })
], Card.prototype, "mediaHref", void 0);
__decorate([
    property({ type: String })
], Card.prototype, "text", void 0);
__decorate([
    property({ type: String })
], Card.prototype, "description", void 0);
Card = __decorate([
    customElement('hb-card')
], Card);
export { Card };
