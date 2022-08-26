import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";


/**
 * @class ProfileAdminTab
 */
@customElement('hb-profile-admin-tab')
export class ProfileAdminTab extends LitElement {

    render() {
        return html`
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
            <p>Admin Tab</p>
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
    'hb-profile-admin-tab': ProfileAdminTab
  }
}
