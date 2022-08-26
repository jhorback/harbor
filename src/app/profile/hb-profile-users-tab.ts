import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";


/**
 * @class ProfileUsersTab
 */
@customElement('hb-profile-users-tab')
export class ProfileUsersTab extends LitElement {

    render() {
        return html`
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
            <p>Users Tab</p>
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
    'hb-profile-users-tab': ProfileUsersTab
  }
}
