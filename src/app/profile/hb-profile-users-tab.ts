import { linkProp } from "@domx/linkprop";
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { UserListData, IUserListData, RequestUserListEvent } from "../data/hb-user-list-data";
import { styles } from "../../styles";
import "./hb-user-card";


/**
 * @class ProfileUsersTab
 */
@customElement('hb-profile-users-tab')
export class ProfileUsersTab extends LitElement {

    @property({type: Object})
    users:IUserListData = UserListData.defaultUsers;

    @query("hb-user-list-data")
    $userListData!:HTMLElement;

    async connectedCallback() {
        super.connectedCallback();

        await this.updateComplete;
        this.$userListData.dispatchEvent(new RequestUserListEvent());
    }

    render() {
        return html`
            <hb-user-list-data
                @users-changed=${linkProp(this, "users")}
            ></hb-user-list-data>    
            <section class="users-container">
            ${this.users.list.map(user => html`
                <hb-user-card .state=${user}></hb-user-card>
            `)}
            </section> 
        `;
    }

    static styles = [styles.types, css`
        :host {
            display: block;
        }
        .users-container {
            display: grid;
            grid-template-columns: repeat(3, auto);
            column-gap: 1rem;
            row-gap: 1rem;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-profile-users-tab': ProfileUsersTab
  }
}
