import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";


/**
 * @class LinkTab
 */
@customElement('hb-link-tab')
export class LinkTab extends LitElement {

    @property({type: String}) label = "";

    @property({type: String}) href = "";

    @property({type: Boolean}) selected = false;

    render() {
        return html`
            <a
                href=${this.href}
                class="link title-medium"
                ?selected=${this.selected}
            >
                ${this.label}
            </a>
        `;
    }

    static styles = [styles.type, css`
        :host {
            display: inline-block;
        }
        .link, .link:hover {
            display: inline-block;
            height: 38px;
            padding: 0 1rem;
            border-radius: var(--md-sys-shape-corner-extra-large);
            background-color: transparent;
            text-decoration: none;
            color: var(--md-sys-color-on-background);
            line-height: 38px;
        }

        .link:hover {
            background-color: var(--md-sys-color-surface-variant);
        }
        .link:focus, .link:active {
            outline: none;
            background-color: var(--hb-sys-color-surface-tint5);
        }
        .link[selected],
        .link[selected]:hover,
        .link[selected]:active,
        .link[selected]:focus {
            color: var(--md-sys-color-on-primary);
            background-color:  var(--md-sys-color-primary);
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-link-tab': LinkTab
  }
}
