import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
import "../layout/hb-page-layout";

/**
 * 
 */
@customElement('hb-doc-page')
export class HbDocPage extends LitElement {

    @property({type: String})
    uid!:String;

    render() {
        return html`      
            <hb-page-layout>
                <div class="page-container">
                    <h1>HB-DOC-PAGE</h1>
                    Test document, uid = <span class="primary-text">${this.uid}</span>
                    <p>
                        <a href="/bad-link">Bad Link</a>
                    </p>
                </div>
                
            </hb-page-layout>
        `
    }

    static styles = [styles.page, styles.types, styles.colors, css`
        :host {
            display: block;
        }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-doc-page': HbDocPage
  }
}
