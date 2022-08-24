import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles } from "../styles/typeStyles";


/**
 * @class LinkButton
 */
@customElement('hb-link-button')
export class LinkButton extends LitElement {

    @property({type: String}) label = "";

    @property({type: String}) href = "";

    @property({type: Boolean}) disabled = false;

    render() {
        return html`
            <span
                class="button"
                ?disabled=${this.disabled}
            >
                <a
                    href=${this.href}
                    class="link label-large"
                    ?disabled=${this.disabled}
                >
                    ${this.label}
                </a>
            </span>
        `;
    }

    static styles = [typeStyles, css`
        :host {
            display: inline-block;
        }

        .button {
            display: inline-block;
            height: 38px;
            padding: 0 1rem;
            border: 1px solid var(--md-sys-color-outline);
            border-radius: var(--md-sys-shape-corner-extra-large);
            background-color: transparent;
        }
        .link, .link:hover {
            text-decoration: none;
            color: var(--md-sys-color-primary);
            line-height: 38px;
        }

        .button:hover {
            background-color: var(--hb-sys-color-surface-tint2);
        }
        .button:focus, .button:active {
            outline: none;
            background-color: var(--hb-sys-color-surface-tint4);
        }
        .button:active {
            background-color: var(--hb-sys-color-surface-tint5);
        }
        .button[disabled],
        .button[disabled]:hover,
        .button[disabled]:active,
        .button[disabled]:focus {
            color: var(--md-sys-color-on-surface);
            background-color: transparent;
            opacity: 0.38;
        }
        .button[disabled] .link {
            cursor: default;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-link-button': LinkButton
  }
}
