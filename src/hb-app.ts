import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "./styles";
import "./layout/hb-page-layout";
// testing
import { FbApp } from "./domain/FbApp";
import { GoogleAnalytics } from "./domain/GoogleAnalytics";
import { signin } from "./domain/GoogleAuth";
// init
FbApp.current;
GoogleAnalytics.current;
console.log(FbApp.current, GoogleAnalytics.current);
signin();



/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('hb-app')
export class HarborApp extends LitElement {


  render() {
    return html`      
      <hb-page-layout>
        <div class="content">
          <h1>HB-APP</h1>
        </div>
      </hb-page-layout>
    `
  }

  static styles = [styles.types, styles.icons, css`
    :host {
      display: block;
    }
    .content {
      max-width: 750px;
      margin: auto;
      padding: 1rem;
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-app': HarborApp
  }
}
