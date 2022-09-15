import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles } from "../styles/typeStyles";


/**
 * @class Button
 * @fires hb-button-click
 */
@customElement('hb-button')
export class Button extends LitElement {

    @property({type: String})
    label = "";

    @property({type: Boolean})
    disabled = false;

    @property({type: Boolean})
    selected = false;

    @property({type: Boolean})
    tonal = false;

    render() {
        return html`
            <button
                ?disabled=${this.disabled}
                ?selected=${this.selected}
                ?tonal=${this.tonal}
                class="label-large"
                @click=${this.handleClick}>
                ${this.label}
            </button>
        `;
    }
    
    handleClick(event:Event) {
        this.dispatchEvent(new Event("hb-button-click", {bubbles: true, composed: false}));
    }

    static styles = [typeStyles, css`
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
        button[tonal] {
            color: var(--md-sys-color-on-secondary-container);
            background-color: var(--md-sys-color-secondary-container);
            border: 1px solid var(--md-sys-color-secondary-container);
            opacity: 0.9;
        }
        button[tonal]:hover {
            opacity: 1;
        }
        button[tonal]:active {
            opacity: 0.9;
        }
        button[disabled], button[disabled]:hover, button[disabled]:active, button[disabled]:focus {
            color: var(--md-sys-color-on-surface);
            background-color: transparent;
            opacity: 0.38;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-button': Button
  }
}
