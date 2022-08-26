import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";


/**
 * @class ProfileContentTab
 */
@customElement('hb-profile-content-tab')
export class ProfileContentTab extends LitElement {

    render() {
        return html`
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
            <p>Content Tab</p>
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
    'hb-profile-content-tab': ProfileContentTab
  }
}
