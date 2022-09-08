var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { iconStyles } from "../styles/iconStyles";
/**
 * @class AvatarButton
 *
 * @event hb-avatar-button-click
 */
let AvatarButton = class AvatarButton extends LitElement {
    constructor() {
        super(...arguments);
        this.href = "";
    }
    render() {
        return html `
      <button class="avatar-container" @click=${this.onClick} tabindex="-1">
        <span tabindex="0 "class="avatar avatar-text" ?hidden=${this.href ? true : false}>
          <!-- could put 1-2 letter initials here too OR make this an option over href -->
          <span class="material-symbols-outlined">person</span>
        </span>      
        <img tabindex="0" src=${this.href} class="avatar" ?hidden=${this.href ? false : true} @error=${this.onImageError}>
    </button>
    `;
    }
    onImageError(event) {
        console.log(`hb-avatar-button image failed to load, falling back to use an icon`);
        this.href = "";
    }
    onClick() {
        this.dispatchEvent(new CustomEvent("hb-avatar-button-click", { bubbles: true, composed: true }));
    }
    static { this.styles = [iconStyles, css `
    :host {
      display: inline-block;
      color: var(--md-sys-color-on-background);
    }
    .avatar-container {
      margin: 0;
      padding: 0;
      background-color: transparent;
      border: none;
    }
    .avatar-container:focused {
      outline: none;
    }
    .avatar {
      position: relative;
      cursor: default;
      user-select: none;
      vertical-align: middle;
      width: 32px;
      height: 32px;
      border-radius: var(--md-sys-shape-corner-full);
      display: inline-block;
      padding: 4px;
      transition: 0.4s;
    }
    .avatar:hover {
      background-color: var(--hb-sys-color-surface-tint5);
    }
    .avatar:focus {
      outline: 1px solid var(--md-sys-color-outline);
    }
    .avatar:active {
      outline: 1px solid var(--md-sys-color-on-background);
    }
    .avatar-text {
      background-color: var(--md-sys-color-primary);
      color: var(--md-sys-color-on-primary);
      font-size: var(--md-sys-typescale-title-medium-font-size);
      line-height: 32px;
      text-align: center;
    }
    .avatar-text:hover {
      background-color: var(--md-sys-color-secondary);
    }
    .material-symbols-outlined{
      line-height: 32px;
    }
    [hidden] {
      display: none;
    }
  `]; }
};
__decorate([
    property({ type: String })
], AvatarButton.prototype, "href", void 0);
AvatarButton = __decorate([
    customElement('hb-avatar-button')
], AvatarButton);
export { AvatarButton };
