import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
// import { iconStyles } from "../styles/iconStyles";


/**
 * @class AppBar
 */
@customElement('hb-app-bar')
export class AppBar extends LitElement {

  render() {
    return html`
      <div>
        HB-APP-BAR
      </div>
    `
  }

  static styles = [css`
    :host {
      display: block;
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-app-bar': AppBar
  }
}
