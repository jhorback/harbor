var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { linkProp } from "@domx/linkprop";
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { UserListData, RequestUserListEvent } from "../data/hb-user-list-data";
import { styles } from "../../styles";
import "./hb-user-card";
/**
 * @class ProfileUsersTab
 */
let ProfileUsersTab = class ProfileUsersTab extends LitElement {
    constructor() {
        super(...arguments);
        this.users = UserListData.defaultUsers;
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.updateComplete;
        this.$userListData.dispatchEvent(new RequestUserListEvent());
    }
    render() {
        return html `
            <hb-user-list-data
                @users-changed=${linkProp(this, "users")}
            ></hb-user-list-data>    
            <section class="users-container">
            ${this.users.list.map(user => html `
                <hb-user-card .state=${user}></hb-user-card>
            `)}
            </section> 
        `;
    }
    static { this.styles = [styles.types, css `
        :host {
            display: block;
        }
        .users-container {
            display: grid;
            grid-template-columns: repeat(2, 374px);
            column-gap: 1rem;
            row-gap: 1rem;
        }
    `]; }
};
__decorate([
    property({ type: Object })
], ProfileUsersTab.prototype, "users", void 0);
__decorate([
    query("hb-user-list-data")
], ProfileUsersTab.prototype, "$userListData", void 0);
ProfileUsersTab = __decorate([
    customElement('hb-profile-users-tab')
], ProfileUsersTab);
export { ProfileUsersTab };
