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
        console.log(user.role);
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
                <div class="body-large"
                    title=${user.lastLogin?.toLocaleTimeString()}
                >${user.lastLogin?.toLocaleDateString()}</div>
            </div>
            <div class="line-item">
                <div class="stretch body-medium">First login</div>
                <div class="body-large"
                    title=${user.firstLogin?.toLocaleTimeString()}
                >${user.firstLogin?.toLocaleDateString()}</div>
            </div>
            <div class="line-item">
                <div class="stretch body-medium">Role</div>
                <select
                    id="userRole"
                        .value=${user.role || UserRole.none}
                        @change=${this.userRoleChanged}
                        class="small">
                    <option ?selected=${user.role === UserRole.none} value=${UserRole.none}>None</option>
                    <option ?selected=${user.role === UserRole.author} value=${UserRole.author}>Author</option>
                    <option ?selected=${user.role === UserRole.userAdmin} value=${UserRole.userAdmin}>User Admin</option>
                    <option ?selected=${user.role === UserRole.siteAdmin} value=${UserRole.siteAdmin}>Site Admin</option>
                </select>
            </div>
        `;
    }

    private userRoleChanged(event:Event) {
        const role = (event.target as HTMLSelectElement).value as UserRole;
        this.dispatchEvent(new UpdateUserRoleEvent(this.state.uid!, role));
    }

    static styles = [styles.types, styles.form, css`
        :host {
            display: block;
            border-radius: var(--md-sys-shape-corner-large);
            background-color: var(--hb-sys-color-surface-tint3);
        }
        .line-item {
            display: flex;
            gap: 10px;
            padding: 0.5rem 1rem;
            align-items: center;
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
