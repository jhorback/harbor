var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
export class TextInputChangeEvent extends Event {
    constructor(value, enterKey) {
        super(TextInputChangeEvent.eventType, { bubbles: true, composed: false });
        this.value = value;
        this.enterKey = enterKey;
    }
    static { this.eventType = "hb-text-input-change"; }
}
/**
 * @class TextInput
 * @fires hb-text-input
 */
let TextInput = class TextInput extends LitElement {
    constructor() {
        super(...arguments);
        this.value = "";
        this.errorText = "";
        this.placeholder = "";
        this.autofocus = false;
    }
    render() {
        return html `
            <div class=${classMap({ "text-input-container": true, "property-error": this.errorText ? true : false })}>
                <input
                    type="text"
                    class="text-input"
                    placeholder=${this.placeholder}
                    .value=${this.value}
                    ?autofocus=${this.autofocus}
                    @keyup=${this.textKeyUp}>
                <div class="error-text body-small">
                    ${this.errorText}
                </div>
            </div>
        `;
    }
    textKeyUp(event) {
        const value = event.target.value;
        const enterKey = event.key === "Enter";
        this.dispatchEvent(new TextInputChangeEvent(value, enterKey));
    }
    static { this.styles = [styles.icons, styles.types, css `
        :host {
            display: block;
        }
        .text-input-container {
            padding-right: 2rem;
        }
        .text-input {
            font-weight: var(--md-sys-typescale-body-large-font-weight);
            font-size: var(--md-sys-typescale-body-large-font-size);
            border-radius:  var(--md-sys-shape-corner-extra-small);
            outline: 0;
            border: 1px solid var(--md-sys-color-on-background);
            color: var(--md-sys-color-on-background);
            line-height: 54px;            
            max-width: 100%;
            width: 100%;
            padding: 0 1rem;
            background: transparent;
        }
        .property-error .text-input {
            border-color: var(--md-sys-color-error);
        }
        .property-error .text-input:focus {
            border-color: var(--md-sys-color-error) !important;
            outline: none;
        }
        .error-text {
            color: var(--md-sys-color-error);
            padding-left: 1rem;
            padding-top: 4px;
            height: 16px;
        }
    `]; }
};
__decorate([
    property({ type: String, reflect: true })
], TextInput.prototype, "value", void 0);
__decorate([
    property({ type: String, attribute: "error-text" })
], TextInput.prototype, "errorText", void 0);
__decorate([
    property({ type: String })
], TextInput.prototype, "placeholder", void 0);
__decorate([
    property({ type: Boolean })
], TextInput.prototype, "autofocus", void 0);
TextInput = __decorate([
    customElement('hb-text-input')
], TextInput);
export { TextInput };
