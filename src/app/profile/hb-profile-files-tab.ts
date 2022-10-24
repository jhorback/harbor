import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";


/**
 * @class ProfileContentTab
 */
@customElement('hb-profile-files-tab')
export class ProfileContentTab extends LitElement {

    render() {
        return html`
            Files
        `;
    }

    static styles = [styles.types, css`
        :host {
            display: block;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-profile-files-tab': ProfileContentTab
  }
}
