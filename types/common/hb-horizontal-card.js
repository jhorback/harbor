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
 * @fires hb-horizontal-card-click
 * Styling:
 * --hb-horizontal-card-cursor
 */
let HorizontalCard = class HorizontalCard extends LitElement {
    constructor() {
        super(...arguments);
        this.mediaUrl = "";
        this.mediaHref = "";
        this.linkTarget = "";
        this.text = "";
        this.description = "";
        this.selected = false;
    }
    render() {
        return html `
            <div class="horizontal-card" @click=${this.handleClick} ?selected=${this.selected}>
                <div class="text">
                    ${this.mediaHref ? html `
                        <a href=${this.mediaHref} target=${this.linkTarget}>
                            <div class="title-medium readable" title=${this.text}>${this.text}</div>
                        </a>
                    ` : html `
                        <div class="title-medium readable" title=${this.text}>${this.text}</div>
                    `}                    
                    <div class="body-medium readable" title=${this.description}>${this.description}</div>
                    <slot></slot>
                </div>
                <div class="media" ?hidden=${this.mediaUrl === ""}>
                    ${this.mediaHref ? html `
                        <a href=${this.mediaHref} target=${this.linkTarget}>
                            <div id="thumbnail" style="background-image: url(${this.mediaUrl})"></div>
                        </a>
                    ` : html `
                        <div id="thumbnail" style="background-image: url(${this.mediaUrl})"></div>
                    `}                    
                </div>
            </div>
        `;
    }
    handleClick(event) {
        this.dispatchEvent(new Event("hb-horizontal-card-click", { bubbles: true, composed: false }));
    }
    static { this.styles = [styles.icons, styles.types, css `
        :host {
            display: block;
            --hb-horizontal-card-cursor: default;
        }
        .horizontal-card {
            overflow: clip;
            display: flex;
            user-select: none;
            border-radius:  var(--md-sys-shape-corner-small);
            border: 1px solid transparent;
            padding: 0 0 0 10px;
            align-items: center;
            cursor: var(--hb-horizontal-card-cursor);
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
        .media,.media #thumbnail { 
            width: 80px;
            height: 80px;
        }
        .media #thumbnail {
            overflow: hidden;
            background-size: cover;
        }
    `]; }
};
__decorate([
    property({ type: String, attribute: "media-url" })
], HorizontalCard.prototype, "mediaUrl", void 0);
__decorate([
    property({ type: String, attribute: "media-href" })
], HorizontalCard.prototype, "mediaHref", void 0);
__decorate([
    property({ type: String, attribute: "link-target" })
], HorizontalCard.prototype, "linkTarget", void 0);
__decorate([
    property({ type: String })
], HorizontalCard.prototype, "text", void 0);
__decorate([
    property({ type: String })
], HorizontalCard.prototype, "description", void 0);
__decorate([
    property({ type: Boolean, reflect: true })
], HorizontalCard.prototype, "selected", void 0);
HorizontalCard = __decorate([
    customElement('hb-horizontal-card')
], HorizontalCard);
export { HorizontalCard };
