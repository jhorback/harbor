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
    constructor(target, enterKey) {
        super(TextInputChangeEvent.eventType, { bubbles: true, composed: true });
        this.enterKey = enterKey;
        this.targetEl = target;
    }
    get value() { return this.targetEl.value; }
    ;
}
TextInputChangeEvent.eventType = "hb-text-input-change";
/**
 * @class TextInput
 * @fires hb-text-input
 */
let TextInput = class TextInput extends LitElement {
    constructor() {
        super(...arguments);
        this.value = "";
        this.label = "";
        this.helperText = "";
        this.readonly = false;
        this.errorText = "";
        this.placeholder = "";
        this.autofocus = false;
    }
    render() {
        return html `
            <div class=${classMap({ "text-input-container": true, "property-error": this.errorText ? true : false })}>
                ${this.label ? html `
                    <div class="label-large">${this.label}</div>
                ` : html ``}
                <input
                    type="text"
                    class="text-input"                    
                    placeholder=${this.placeholder}
                    .value=${this.value}
                    ?readonly=${this.readonly}
                    ?autofocus=${this.autofocus}
                    @keyup=${this.textKeyUp}>
                <div class="helper-text body-small">
                    ${this.errorText ? html `
                        <span class="error-text">${this.errorText}</span>
                    ` : this.helperText}
                </div>
            </div>
        `;
    }
    textKeyUp(event) {
        const target = event.target;
        const value = target.value;
        const enterKey = event.key === "Enter";
        this.dispatchEvent(new TextInputChangeEvent(target, enterKey));
    }
};
TextInput.styles = [styles.icons, styles.types, css `
        :host {
            display: block;
        }
        .text-input-container {
            padding-right: 2rem;
        }
        .label-large {
            padding-bottom: 4px;
        }
        .text-input {
            font-weight: var(--md-sys-typescale-body-large-font-weight);
            font-size: var(--md-sys-typescale-body-large-font-size);
            border-radius:  var(--md-sys-shape-corner-extra-small);
            outline: 0;
            border: 1px solid var(--md-sys-color-outline);
            color: var(--md-sys-color-on-background);
            line-height: 54px;            
            max-width: 100%;
            width: 100%;
            padding: 0 1rem;
            background: transparent;
        }
        .text-input:focus {
            border: 1px solid var(--md-sys-color-on-background);
        }
        .text-input[readonly] {
            border-color: var(--md-sys-color-outline);
            opacity: 0.7;
        }
        .property-error .text-input {
            border-color: var(--md-sys-color-error);
        }
        .property-error .text-input:focus {
            border-color: var(--md-sys-color-error) !important;
            outline: none;
        }
        .helper-text {
            padding-left: 1rem;
            padding-top: 4px;
            height: 16px;
        }
        .error-text {
            color: var(--md-sys-color-error);
        }
    `];
__decorate([
    property({ type: String, reflect: true })
], TextInput.prototype, "value", void 0);
__decorate([
    property({ type: String })
], TextInput.prototype, "label", void 0);
__decorate([
    property({ type: String, attribute: "helper-text" })
], TextInput.prototype, "helperText", void 0);
__decorate([
    property({ type: Boolean })
], TextInput.prototype, "readonly", void 0);
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
