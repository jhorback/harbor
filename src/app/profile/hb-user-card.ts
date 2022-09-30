import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { IUserData } from "../../domain/interfaces/UserInterfaces";
import { UserRole } from "../../domain/User/UserRoles";
import { styles } from "../../styles";
import { Button } from "../../common/hb-button";
import "../../common/hb-avatar";
import { UpdateUserRoleEvent, UserListData } from "../data/hb-user-list-data";


/**
 * @class ProfileAdminTab
 */
@customElement('hb-user-card')
export class UserCard extends LitElement {

    @property({type:Object})
    state!:IUserData;

    render() {
        const user = this.state;
        return html`
            <div class="line-item">
                <hb-avatar href=${user.photoURL}></hb-avatar>
                <div>
                    <div class="title-medium">${user.displayName}</div>
                    <div class="body-medium">${user.email}</div>
                </div>
            </div>
            
            <div class="line-item">
                <div class="stretch body-medium">Last login</div>
                <div class="body-large">${this.displayDate(user.lastLogin)}</div>
            </div>
            <div class="line-item">
                <div class="stretch body-medium">First login</div>
                <div class="body-large">${this.displayDate(user.firstLogin)}</div>
            </div>
            
            <div class="line-item right">
                <hb-button
                    label="Author"
                    ?selected=${user.role === UserRole.author}
                    @click=${(e:Event) => this.clickedRole(e, UserRole.author)}
                ></hb-button>
                <hb-button
                    label="User Admin"
                    ?selected=${user.role === UserRole.userAdmin}
                    @click=${(e:Event) => this.clickedRole(e, UserRole.userAdmin)}
                ></hb-button>
                <hb-button
                    label="Site Admin"
                    ?selected=${user.role === UserRole.siteAdmin}
                    @click=${(e:Event) => this.clickedRole(e, UserRole.siteAdmin)}
                ></hb-button>
            </div>           
        `;
    }

    private displayDate(date?:Date) {
        return `${date?.toLocaleDateString()} ${date?.toLocaleTimeString()}`;
    }

    private clickedRole(event:Event, role:UserRole) {
        (event.target as Button).selected = true;
        if (role === this.state.role) {
            role = UserRole.none;
        }
        this.dispatchEvent(new UpdateUserRoleEvent(this.state.uid!, role));
    }

    static styles = [styles.types, css`
        :host {
            display: block;
            border-radius: var(--md-sys-shape-corner-large);
            background-color: var(--hb-sys-color-surface-tint3);
        }
        .line-item {
            display: flex;
            gap: 10px;
            padding: 1rem;
        }
        .stretch {
            flex-grow: 1;
        }
        .right {
            justify-content: end;
        }
        hr {
            padding: 0;
            margin: 0;
            border-color: var(--md-sys-color-outline);
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-user-card': UserCard
  }
}
