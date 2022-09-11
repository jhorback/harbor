var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles } from "../styles/typeStyles";
/**
 * @class Button
 * @fires hb-button-click
 */
let Button = class Button extends LitElement {
    constructor() {
        super(...arguments);
        this.label = "";
        this.disabled = false;
        this.selected = false;
    }
    render() {
        return html `
            <button
                ?disabled=${this.disabled}
                ?selected=${this.selected}
                class="label-large"
                @click=${this.handleClick}>
                ${this.label}
            </button>
        `;
    }
    handleClick(event) {
        this.dispatchEvent(new Event("hb-button-click", { bubbles: true, composed: false }));
    }
};
Button.styles = [typeStyles, css `
        :host {
            display: inline-block;
        }

        button {
            height: 40px;
            padding: 0 1rem;
            color: var(--md-sys-color-primary);
            border: 1px solid var(--md-sys-color-outline);
            border-radius: var(--md-sys-shape-corner-extra-large);
            background-color: transparent;
        }
        button:hover {
            background-color: var(--hb-sys-color-surface-tint2);
        }
        button:focus, button:active {
            outline: none;
            background-color: var(--hb-sys-color-surface-tint4);
        }
        button:active {
            background-color: var(--hb-sys-color-surface-tint5);
        }
        button[selected] {
            color: var(--md-sys-color-on-primary);
            background-color:  var(--md-sys-color-primary);
        }
        button[disabled], button[disabled]:hover, button[disabled]:active, button[disabled]:focus {
            color: var(--md-sys-color-on-surface);
            background-color: transparent;
            opacity: 0.38;
        }
    `];
__decorate([
    property({ type: String })
], Button.prototype, "label", void 0);
__decorate([
    property({ type: Boolean })
], Button.prototype, "disabled", void 0);
__decorate([
    property({ type: Boolean })
], Button.prototype, "selected", void 0);
Button = __decorate([
    customElement('hb-button')
], Button);
export { Button };
