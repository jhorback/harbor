var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { iconStyles } from "../styles/iconStyles";
export var AvatarSize;
(function (AvatarSize) {
    AvatarSize["small"] = "small";
    AvatarSize["large"] = "large";
})(AvatarSize || (AvatarSize = {}));
/**
 * @class Avatar
 */
let Avatar = class Avatar extends LitElement {
    constructor() {
        super(...arguments);
        this.size = AvatarSize.small;
        this.href = "";
    }
    render() {
        return html `
        <div class=${this.size}>
          <span class="avatar avatar-text" ?hidden=${this.href ? true : false}>
            <!-- could put 1-2 letter initials here too OR make this an option over href -->
            <span class="material-symbols-outlined">person</span>
          </span>      
          <img src=${this.href} class="avatar" ?hidden=${this.href ? false : true} @error=${this.onImageError}>
        </div>
    `;
    }
    onImageError(event) {
        console.log(`hb-avatar image failed to load, falling back to use an icon`);
        this.href = "";
    }
};
Avatar.styles = [iconStyles, css `
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
    .large .avatar {
      width: 96px;
      height: 96px;
    }
    .large .avatar-text, .large .material-symbols-outlined {
      font-size: 72px;
      line-height: 96px;
    }
  `];
__decorate([
    property({ type: String })
], Avatar.prototype, "size", void 0);
__decorate([
    property({ type: String })
], Avatar.prototype, "href", void 0);
Avatar = __decorate([
    customElement('hb-avatar')
], Avatar);
export { Avatar };
