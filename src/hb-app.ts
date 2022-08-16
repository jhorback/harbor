import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles, typeStylesDisplayLarge } from "./styles/typeStyles";
import "./hb-style-guide";
import { AvatarType } from "./hb-avatar";
// import litLogo from "./assets/lit.svg"


/**
 * An example element.
 *
 * @slot - This element has a slot
 * @csspart button - The button
 */
@customElement('hb-app')
export class HarborApp extends LitElement {
  /**
   * Copy for the read the docs hint.
   */
  @property()
  docsHint = 'Click on the Vite and Lit logos to learn more'

  /**
   * The number of times the button has been clicked.
   */
  @property({ type: Number })
  count = 0

  render() {
    return html`      
      <slot></slot>
      <hb-avatar type="${AvatarType.USER_PROFILE}" href="test/user1.png"></hb-avatar>
      <hb-style-guide></hb-style-guide>
    `
  }

  static styles = [typeStyles, css`
    :host {
      max-width: 1280px;
      margin: 0 auto;
      padding: 2rem;
      text-align: center;
    }
    ::slotted(h1) {
      ${typeStylesDisplayLarge}
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-app': HarborApp
  }
}
