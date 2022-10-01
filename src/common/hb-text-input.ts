import { html, css, LitElement } from "lit";
import { classMap } from 'lit/directives/class-map.js';
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";


export class TextInputChangeEvent extends Event {
    static eventType = "hb-text-input-change";
    value:string;
    enterKey:boolean;
    constructor(value:string, enterKey: boolean) {
        super(TextInputChangeEvent.eventType, { bubbles:true, composed: false});
        this.value = value;
        this.enterKey = enterKey;
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

    @property({type: String, attribute: "error-text"})
    errorText = "";

    @property({type: String})
    placeholder = "";

    @property({type: Boolean})
    autofocus = false;

    render() {
        return html`
            <div class=${classMap({"text-input-container":true, "property-error": this.errorText ? true : false})}>
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

    textKeyUp(event:KeyboardEvent) {
        const value = (event.target as HTMLInputElement).value;
        const enterKey = event.key === "Enter";
        this.dispatchEvent(new TextInputChangeEvent(value, enterKey));
    }

    static styles = [styles.icons, styles.types, css`
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
    `]
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-text-input': TextInput
    }
}
