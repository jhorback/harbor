import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import "../docTypes/hb-doc-page";


/**
 * The job of this element is to look the home page
 * document up in the database and append the correct element to the dom
 */
@customElement('hb-home')
export class HbHome extends LitElement {


    // the job of this element i
    render() {
        return html`      
            <hb-doc-page uid="doc:home"></hb-doc-page>
        `;
    }

    static styles = [css`
        :host {
            display: block;
        }
    `];
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-home': HbHome
  }
}
