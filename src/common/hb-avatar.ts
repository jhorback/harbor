import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { iconStyles } from "../styles/iconStyles";


export enum AvatarSize {
  small = "small",
  medium = "medium",
  large = "large"
}

/**
 * @class Avatar
 */
@customElement('hb-avatar')
export class Avatar extends LitElement {

  @property({type: String})
  size = AvatarSize.small

  @property({ type: String})
  href = "";

  render() {
    return html`
        <div class=${this.size}>
          <span class="avatar avatar-text" ?hidden=${this.href ? true : false}>
            <!-- could put 1-2 letter initials here too OR make this an option over href -->
            <span class="material-symbols-outlined">person</span>
          </span>      
          <img src=${this.href} class="avatar" ?hidden=${this.href ? false : true} @error=${this.onImageError}>
        </div>
    `
  }

  private onImageError(event:Event) {
    console.log(`hb-avatar image failed to load, falling back to use an icon`);
    this.href = "";
  }

  static styles = [iconStyles, css`
    :host {
      display: inline-block;
      cursor: default;
      user-select: none;
      color: var(--md-sys-color-on-background);
    }
    .avatar { 
      vertical-align: middle;
      border-radius: var(--md-sys-shape-corner-full);
      border: 1px solid var(--md-sys-color-on-background);
      display: inline-block;
      padding: 2px;
    }
    .avatar-text {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      text-align: center;
    }
    [hidden] {
      display: none;
    }

    .small .avatar {
      width: 32px;
      height: 32px;
    }
    .small .avatar-text, .small .material-symbols-outlined {
      font-size: 24px;
      line-height: 32px;
    }
    .medium .avatar {
      width: 48px;
      height:48px;
    }
    .medium .avatar-text, .medium .material-symbols-outlined {
      font-size: 42px;
      line-height: 48px;
    }
    .large .avatar {
      width: 96px;
      height: 96px;
    }
    .large .avatar-text, .large .material-symbols-outlined {
      font-size: 72px;
      line-height: 96px;
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-avatar': Avatar
  }
}
