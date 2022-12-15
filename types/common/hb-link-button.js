var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles } from "../styles/typeStyles";
import { ifDefined } from 'lit/directives/if-defined.js';
/**
 * @class LinkButton
 */
let LinkButton = class LinkButton extends LitElement {
    constructor() {
        super(...arguments);
        this.label = "";
        this.href = "";
        this.disabled = false;
        this.target = "";
    }
    render() {
        return html `
            <a
                href=${this.href}
                class="link label-large"
                ?disabled=${this.disabled}
                target=${ifDefined(this.target)}
            >
                ${this.label}
            </a>
        `;
    }
    static { this.styles = [typeStyles, css `
        :host {
            display: inline-block;
        }
        .link, .link:hover {
            display: inline-block;
            height: 38px;
            padding: 0 1rem;
            border: 1px solid var(--md-sys-color-outline);
            border-radius: var(--md-sys-shape-corner-extra-large);
            background-color: transparent;
            text-decoration: none;
            color: var(--md-sys-color-primary);
            line-height: 38px;
        }
        .link:hover {
            background-color: var(--hb-sys-color-surface-tint2);
        }
        .link:focus, .link:active {
            outline: none;
            background-color: var(--hb-sys-color-surface-tint4);
        }
        .link:active {
            background-color: var(--hb-sys-color-surface-tint5);
        }
        .link[disabled],
        .link[disabled]:hover,
        .link[disabled]:active,
        .link[disabled]:focus {
            color: var(--md-sys-color-on-surface);
            background-color: transparent;
            opacity: 0.38;
            cursor: default;
        }
    `]; }
};
__decorate([
    property({ type: String })
], LinkButton.prototype, "label", void 0);
__decorate([
    property({ type: String })
], LinkButton.prototype, "href", void 0);
__decorate([
    property({ type: Boolean })
], LinkButton.prototype, "disabled", void 0);
__decorate([
    property({ type: String })
], LinkButton.prototype, "target", void 0);
LinkButton = __decorate([
    customElement('hb-link-button')
], LinkButton);
export { LinkButton };
