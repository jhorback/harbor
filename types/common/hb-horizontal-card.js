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
 */
let HorizontalCard = class HorizontalCard extends LitElement {
    constructor() {
        super(...arguments);
        this.mediaUrl = "";
        this.mediaHref = "";
        this.linkTarget = "";
        this.text = "";
        this.description = "";
    }
    render() {
        return html `
            <div class="horizontal-card" @click=${this.handleClick}>
                <div class="text">
                    <a href=${this.mediaHref} target=${this.linkTarget}>
                        <div class="title-medium readable">${this.text}</div>
                    </a>
                    <div class="body-medium readable">${this.description}</div>
                </div>
                <div class="media" ?hidden=${this.mediaUrl === ""}>
                    <a href=${this.mediaHref} target=${this.linkTarget}>
                        <img src=${this.mediaUrl} @error=${this.onImageError}>
                    </a>
                </div>
            </div>
        `;
    }
    handleClick(event) {
        this.dispatchEvent(new Event("hb-horizontal-card-click", { bubbles: true, composed: false }));
    }
    onImageError(event) {
        console.log(`hb-avatar image failed to load, falling back to use an icon`);
        this.mediaUrl = "";
    }
};
HorizontalCard.styles = [styles.icons, styles.types, css `
        :host {
            display: block;
        }
        .horizontal-card {
            overflow: clip;
            display: flex;
            user-select: none;
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
        a {
            text-decoration: none;

        }
        .title-medium {
            line-height: 2rem;
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
    `];
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
HorizontalCard = __decorate([
    customElement('hb-horizontal-card')
], HorizontalCard);
export { HorizontalCard };
