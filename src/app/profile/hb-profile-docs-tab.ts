import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";


/**
 * @class ProfileDocsTab
 */
@customElement('hb-profile-docs-tab')
export class ProfileDocsTab extends LitElement {

    render() {
        return html`
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
            <p>Docs Tab</p>
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
    'hb-profile-docs-tab': ProfileDocsTab
  }
}
