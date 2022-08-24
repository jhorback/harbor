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

    render() {
        return html`
            <button
                ?disabled=${this.disabled}
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
