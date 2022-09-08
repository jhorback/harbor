import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { IUserData } from "../../domain/interfaces/UserInterfaces";
import { CurrentUserData } from "../../hb-current-user-data";
import { linkProp } from "@domx/linkprop";
import { AvatarSize } from "../../common/hb-avatar";
import { styles } from "../../styles";
import { userCan, UserAction } from "../../domain/User/UserRoles";
import "../../layout/hb-page-layout";
import "../../common/tabs/hb-link-tab";
import "../../common/tabs/hb-tab-bar";
import "@domx/router/domx-route";
import "./hb-profile-docs-tab";
import "./hb-profile-content-tab";
import "./hb-profile-users-tab";
import "./hb-profile-admin-tab";



/**
 * @class ProfilePage
 */
@customElement('hb-profile-page')
export class ProfilePage extends LitElement {

    @state()
    selectedTab = "documents-tab";

    @property({type: Object})
    currentUser:IUserData = CurrentUserData.defaultCurrentUser;

    userCan(action:UserAction) {
        return userCan(this.currentUser, action);
    }

    render() {
        return html`
<hb-current-user-data
    @current-user-changed=${linkProp(this, "currentUser")}
></hb-current-user-data>
<hb-page-layout>
    <div class="page-container-large">
        <div class="header">
            <hb-avatar size=${AvatarSize.large} href=${this.currentUser.photoURL}></hb-avatar>
            <div>
                <div class="headline-large">${this.currentUser.displayName}</div>
                <div class="body-large">${this.currentUser.email}</div>
            </div>
        </div>
        <hb-tab-bar selected-tab=${this.selectedTab}>
            <hb-link-tab
                id="documents-tab"
                label="Documents"
                href="/profile/docs"
                ?hidden=${!this.userCan(UserAction.authorDocuments)}
            ></hb-link-tab>
            <hb-link-tab
                id="content-tab"
                label="Content"
                href="/profile/content"
                ?hidden=${!this.userCan(UserAction.uploadContent)}
            ></hb-link-tab>
            <hb-link-tab
                id="users-tab"
                label="Users"
                href="/profile/users"
                ?hidden=${!this.userCan(UserAction.viewUsers)}
            ></hb-link-tab>
            <hb-link-tab
                id="admin-tab"
                label="Admin"
                href="/profile/admin"
                ?hidden=${!this.userCan(UserAction.editSiteSettings)}
            ></hb-link-tab>
        </hb-tab-bar>
        ${this.userCan(UserAction.authorDocuments) ? html`
            <domx-route
                pattern="/profile(/docs)"
                element="hb-profile-docs-tab"
                append-to="#tab-content-container"
                @route-active=${() => this.selectTab("documents-tab")}
            ></domx-route>
        ` : html``}
        ${this.userCan(UserAction.uploadContent) ? html`
            <domx-route
                pattern="/profile/content"
                element="hb-profile-content-tab"
                append-to="#tab-content-container"
                @route-active=${() => this.selectTab("content-tab")}
            ></domx-route>
        ` : html``}
        ${this.userCan(UserAction.viewUsers) ? html`
            <domx-route
                pattern="/profile/users"
                element="hb-profile-users-tab"
                append-to="#tab-content-container"
                @route-active=${() => this.selectTab("users-tab")}
            ></domx-route>
        ` : html``}
        ${this.userCan(UserAction.editSiteSettings) ? html`
            <domx-route
                pattern="/profile/admin"
                element="hb-profile-admin-tab"
                append-to="#tab-content-container"
                @route-active=${() => this.selectTab("admin-tab")}
            ></domx-route>
        ` : html``}        
        <div id="tab-content-container">
        </div>
    </div>
</hb-page-layout>
        `;
    }

    private selectTab(tab:string) {
        this.selectedTab = tab;
    }

    static styles = [styles.types, styles.page, css`
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
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-profile-page': ProfilePage
  }
}
