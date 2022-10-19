var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles } from "../styles/typeStyles";
import { CurrentUserData, SignOutEvent } from "../hb-current-user-data";
import { linkProp } from "@domx/linkprop";
import { AvatarSize } from "../common/hb-avatar";
import "../common/hb-button";
import "../common/hb-link-button";
/**
 * @class UserMenu
 * @fires sign-out
 */
let UserMenu = class UserMenu extends LitElement {
    constructor() {
        super(...arguments);
        this._open = false;
        this.currentUser = CurrentUserData.defaultCurrentUser;
        this.hbAppInfo = CurrentUserData.defaultHbAppInfo;
    }
    get open() {
        return this._open;
    }
    set open(value) {
        const oldVal = this._open;
        this._open = value;
        this.requestUpdate("open", oldVal);
        this._updateDocumentListener();
    }
    async _updateDocumentListener() {
        await this.updateComplete;
        if (!this._open) {
            document.removeEventListener("click", this._documentListener);
        }
        if (this._open) {
            this._documentListener = getDocumentListener(this);
            document.addEventListener("click", this._documentListener);
        }
    }
    render() {
        return html `
            <hb-current-user-data
                @current-user-changed=${linkProp(this, "currentUser")}
                @hb-app-info-changed=${linkProp(this, "hbAppInfo")}
            ></hb-current-user-data>
            <div class="menu-container" ?hidden=${this.open ? false : true}>
                <div class="avatar-container">
                    <hb-avatar
                        href=${this.currentUser.photoURL}
                        size=${AvatarSize.large}
                    ></hb-avatar>
                </div>
                <div class="title-large on-surface-text">${this.currentUser.displayName}</div>
                <div class="body-large on-surface-text dampen">${this.currentUser.email}</div>
                <div class="manage-account-button-container">
                    <hb-link-button label="Manage Account" href="/profile"></hb-link-button>
                </div>
                <hr>
                <div>
                    <hb-button label="Sign Out" @click=${this.handleSignOutClick}></hb-button>
                </div>
                <hr>
                <div class="body-large on-surface-text dampen about-container">
                    <a href="/about">About Harbor ${this.hbAppInfo.version}</a>
                </div>
            </div>
        `;
    }
    handleSignOutClick() {
        this.dispatchEvent(new SignOutEvent());
    }
};
UserMenu.defaultState = {
    displayName: "John Horback",
    email: "jhorback@gmail.com",
    photoURL: "content/avatars/user1.png",
    appVersion: "v0.1.0"
};
UserMenu.styles = [typeStyles, css `
        :host {
            display: block;
            position: absolute;
            top: 60px;
            right: 12px;
            width: 350px;
            background-color: var(--md-sys-color-background);
            z-index: 20;
        }
        .menu-container {  
            border-radius: var(--md-sys-shape-corner-extra-large);
            background-color: var(--hb-sys-color-surface-tint3);
        }
        .menu-container[hidden] {
            display: none;
        }
        .avatar-container {
            padding: 2.5rem 0;  
        }
        div {
            text-align: center;
        }
        .dampen {
            opacity: 0.7;
        }
        hr {
            border-color: var(--md-sys-color-outline);
        }
        hb-button {
            margin: 0.5rem 0;
        }
        .manage-account-button-container {
            margin: 1rem 0;
        }
        .about-container {
            padding: 0.5rem 0 1rem;
        }
        .about-container a {
            color: var(--md-sys-color-on-surface);
            text-decoration: none;
            padding: 6px;
            border-radius: var(--md-sys-shape-corner-small);
        }
        .about-container a:hover {
            background-color: var(--hb-sys-color-surface-tint4);
        }
        .about-container a:focus {
            outline: none;
            background-color: var(--hb-sys-color-surface-tint4);
        }
    `];
__decorate([
    property({ type: Boolean, reflect: true })
], UserMenu.prototype, "open", null);
__decorate([
    property({ type: Object })
], UserMenu.prototype, "currentUser", void 0);
__decorate([
    property({ type: Object })
], UserMenu.prototype, "hbAppInfo", void 0);
UserMenu = __decorate([
    customElement('hb-user-menu')
], UserMenu);
export { UserMenu };
const getDocumentListener = (element) => (event) => {
    const path = event.composedPath();
    if (!pathIsInside(path, "HB-USER-MENU") && !pathIsInside(path, "HB-AVATAR-BUTTON")) {
        element.open = false;
    }
    else if (pathIsInside(path, "HB-BUTTON") || pathIsInside(path, "A")) {
        element.open = false;
    }
};
const pathIsInside = (path, tagName) => path.find(i => i.tagName === tagName) ? true : false;
