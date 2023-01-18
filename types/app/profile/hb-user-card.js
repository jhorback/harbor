var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { UserRole } from "../../domain/User/UserRoles";
import { styles } from "../../styles";
import "../../common/hb-avatar";
import { UpdateUserRoleEvent } from "../data/hb-user-list-data";
/**
 * @class ProfileAdminTab
 */
let UserCard = class UserCard extends LitElement {
    render() {
        const user = this.state;
        console.log(user.role);
        return html `
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
    userRoleChanged(event) {
        const role = event.target.value;
        this.dispatchEvent(new UpdateUserRoleEvent(this.state.uid, role));
    }
    static { this.styles = [styles.types, styles.form, css `
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
    `]; }
};
__decorate([
    property({ type: Object })
], UserCard.prototype, "state", void 0);
UserCard = __decorate([
    customElement('hb-user-card')
], UserCard);
export { UserCard };
