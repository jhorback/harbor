import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";


export enum AvatarType {
    ICON_BUTTON = "icon-button",
    USER_PROFILE = "user-profile"
}


/**
 * 
 */
@customElement('hb-avatar')
export class Avatar extends LitElement {

  @property({ type: String })
  type:AvatarType = AvatarType.ICON_BUTTON;

  @property({ type: String})
  href = "";

  render() {
    return html`      
      AVATAR type: ${this.type}, href: ${this.href}
      <br>
      <img src="${this.href}" width="50">
    `
  }

  static styles = [css`
    :host {
      
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-avatar': Avatar
  }
}
