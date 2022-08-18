import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";


export enum AvatarType {
    ICON_BUTTON = "icon-button",
    USER_PROFILE = "user-profile"
}


/**
 * @class Avatar
 * Hello this is some documentation
 */
@customElement('hb-avatar')
export class Avatar extends LitElement {

  /**
   * Here is property documentation
   */
  @property({ type: String })
  type:AvatarType = AvatarType.ICON_BUTTON;

  @property({ type: String})
  href = "";

  render() {
    return html`      
      AVATAR type: ${this.type}, href: ${this.href}
      <br>
      <img src="${this.href}" width="100" @click="${this.testClick}">
    `
  }

  private testClick() {
    this.dispatchEvent(new CustomEvent("click"));
  }

  static styles = [css`
    :host {
      color: var(--md-sys-color-on-background);
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-avatar': Avatar
  }
}
