import { html, css, LitElement } from "lit";
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";


export class TextInputChangeEvent extends Event {
    static eventType = "hb-text-input-change";
    get value() { return this.targetEl.value };
    enterKey:boolean;
    private targetEl:HTMLInputElement;
    constructor(target:HTMLInputElement, enterKey: boolean) {
        super(TextInputChangeEvent.eventType, { bubbles:true, composed: true});
        this.enterKey = enterKey;
        this.targetEl = target;
    }
}

/**
 * @class TextInput
 * @fires hb-text-input
 */
@customElement('hb-text-input')
export class TextInput extends LitElement {

    @property({type: String, reflect: true})
    value = "";

    @property({type: String})
    label = "";

    @property({type:String, attribute: "helper-text"})
    helperText = "";

    @property({type: String, attribute: "error-text"})
    errorText = "";

    @property({type: String})
    placeholder = "";

    @property({type: Boolean})
    autofocus = false;

    render() {
        return html`
            <div class=${classMap({"text-input-container":true, "property-error": this.errorText ? true : false})}>
                ${this.label ? html`
                    <div class="label-large">${this.label}</div>
                ` : html``}
                <input
                    type="text"
                    class="text-input"
                    placeholder=${this.placeholder}
                    .value=${this.value}
                    ?autofocus=${this.autofocus}
                    @keyup=${this.textKeyUp}>
                <div class="helper-text body-small">
                    ${this.errorText ? html`
                        <span class="error-text">${this.errorText}</span>
                    ` : this.helperText }
                </div>
            </div>
        `;
    }

    textKeyUp(event:KeyboardEvent) {
        const target = event.target as HTMLInputElement;
        const value = target.value;
        const enterKey = event.key === "Enter";
        this.dispatchEvent(new TextInputChangeEvent(target, enterKey));
    }

    static styles = [styles.icons, styles.types, css`
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
        .helper-text {
            padding-left: 1rem;
            padding-top: 4px;
            height: 16px;
        }
        .error-text {
            color: var(--md-sys-color-error);
        }
    `]
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-text-input': TextInput
    }
}
