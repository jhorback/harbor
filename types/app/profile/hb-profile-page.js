var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { CurrentUserData } from "../../hb-current-user-data";
import { linkProp } from "@domx/linkprop";
import { AvatarSize } from "../../common/hb-avatar";
import { styles } from "../../styles";
import { isAuthorized, UserAction } from "../../domain/HbCurrentUser";
import "../../layout/hb-page-layout";
import "../../common/tabs/hb-link-tab";
import "../../common/tabs/hb-tab-bar";
import "@domx/router/domx-route";
import "./hb-profile-pages-tab";
import "./hb-profile-files-tab";
import "./hb-profile-users-tab";
import "./hb-profile-admin-tab";
/**
 * @class ProfilePage
 */
let ProfilePage = class ProfilePage extends LitElement {
    constructor() {
        super(...arguments);
        this.selectedTab = "pages-tab";
        this.currentUser = CurrentUserData.defaultCurrentUser;
    }
    render() {
        return html `
<hb-current-user-data
    @current-user-changed=${linkProp(this, "currentUser")}
></hb-current-user-data>
<hb-page-layout large>
    <div class="header">
        <hb-avatar size=${AvatarSize.large} href=${this.currentUser.photoURL}></hb-avatar>
        <div>
            <div class="headline-large">${this.currentUser.displayName}</div>
            <div class="body-large">${this.currentUser.email}</div>
        </div>
    </div>
    <hb-tab-bar selected-tab=${this.selectedTab}>
        <hb-link-tab
            id="pages-tab"
            label="Pages"
            href="/profile/pages"
            ?hidden=${!isAuthorized(UserAction.authorDocuments)}
        ></hb-link-tab>
        <hb-link-tab
            id="files-tab"
            label="Files"
            href="/profile/files"
            ?hidden=${!isAuthorized(UserAction.uploadFiles)}
        ></hb-link-tab>
        <hb-link-tab
            id="users-tab"
            label="Users"
            href="/profile/users"
            ?hidden=${!isAuthorized(UserAction.viewUsers)}
        ></hb-link-tab>
        <hb-link-tab
            id="admin-tab"
            label="Admin"
            href="/profile/admin"
            ?hidden=${!isAuthorized(UserAction.editSiteSettings)}
        ></hb-link-tab>
    </hb-tab-bar>
    ${isAuthorized(UserAction.authorDocuments) ? html `
        <domx-route
            pattern="/profile(/pages)"
            element="hb-profile-pages-tab"
            append-to="#tab-content-container"
            @route-active=${() => this.selectTab("pages-tab")}
        ></domx-route>
    ` : html ``}
    ${isAuthorized(UserAction.uploadFiles) ? html `
        <domx-route
            pattern="/profile/files"
            element="hb-profile-files-tab"
            append-to="#tab-content-container"
            @route-active=${() => this.selectTab("files-tab")}
        ></domx-route>
    ` : html ``}
    ${isAuthorized(UserAction.viewUsers) ? html `
        <domx-route
            pattern="/profile/users"
            element="hb-profile-users-tab"
            append-to="#tab-content-container"
            @route-active=${() => this.selectTab("users-tab")}
        ></domx-route>
    ` : html ``}
    ${isAuthorized(UserAction.editSiteSettings) ? html `
        <domx-route
            pattern="/profile/admin"
            element="hb-profile-admin-tab"
            append-to="#tab-content-container"
            @route-active=${() => this.selectTab("admin-tab")}
        ></domx-route>
    ` : html ``}        
    <div id="tab-content-container">
    </div>
</hb-page-layout>
        `;
    }
    selectTab(tab) {
        this.selectedTab = tab;
    }
};
ProfilePage.styles = [styles.types, css `
        :host {
            display: block;
        }
        .header {
            display: flex;
            gap: 20px;
            margin-bottom: 1rem;
        }
        #tab-content-container {
            padding: 1rem;
        }
    `];
__decorate([
    state()
], ProfilePage.prototype, "selectedTab", void 0);
__decorate([
    property({ type: Object })
], ProfilePage.prototype, "currentUser", void 0);
ProfilePage = __decorate([
    customElement('hb-profile-page')
], ProfilePage);
export { ProfilePage };
