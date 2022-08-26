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
            <a
                href=${this.href}
                class="link label-large"
                ?disabled=${this.disabled}
            >
                ${this.label}
            </a>
        `;
    }

    static styles = [typeStyles, css`
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
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-link-button': LinkButton
  }
}
