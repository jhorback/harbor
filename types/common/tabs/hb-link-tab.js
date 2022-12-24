var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
/**
 * @class LinkTab
 */
let LinkTab = class LinkTab extends LitElement {
    constructor() {
        super(...arguments);
        this.label = "";
        this.href = "";
        this.selected = false;
    }
    /**
     * The replace-state attribute on the link is for routing.
     * This is used by the domx router.
     */
    render() {
        return html `
            <a
                href=${this.href}
                replace-state
                class="link title-medium"
                ?selected=${this.selected}
            >
                ${this.label}
            </a>
        `;
    }
    static { this.styles = [styles.types, css `
        :host {
            display: inline-block;
        }
        :host([hidden]) {
            display: none;
        }
        .link, .link:hover {
            display: inline-block;
            height: 38px;
            padding: 0 1rem;
            border-radius: var(--md-sys-shape-corner-extra-large);
            background-color: transparent;
            text-decoration: none;
            color: var(--md-sys-color-on-background);
            line-height: 38px;
        }

        .link:hover {
            background-color: var(--md-sys-color-surface-variant);
        }
        .link:focus, .link:active {
            outline: none;
            background-color: var(--hb-sys-color-surface-tint5);
        }
        .link[selected],
        .link[selected]:hover,
        .link[selected]:active,
        .link[selected]:focus {
            color: var(--md-sys-color-on-primary);
            background-color:  var(--md-sys-color-primary);
        }
    `]; }
};
__decorate([
    property({ type: String })
], LinkTab.prototype, "label", void 0);
__decorate([
    property({ type: String })
], LinkTab.prototype, "href", void 0);
__decorate([
    property({ type: Boolean })
], LinkTab.prototype, "selected", void 0);
LinkTab = __decorate([
    customElement('hb-link-tab')
], LinkTab);
export { LinkTab };
