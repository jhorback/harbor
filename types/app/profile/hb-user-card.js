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
                    @click=${(e) => this.clickedRole(e, UserRole.author)}
                ></hb-button>
                <hb-button
                    label="User Admin"
                    ?selected=${user.role === UserRole.userAdmin}
                    @click=${(e) => this.clickedRole(e, UserRole.userAdmin)}
                ></hb-button>
                <hb-button
                    label="Site Admin"
                    ?selected=${user.role === UserRole.siteAdmin}
                    @click=${(e) => this.clickedRole(e, UserRole.siteAdmin)}
                ></hb-button>
            </div>           
        `;
    }
    displayDate(date) {
        return `${date?.toLocaleDateString()} ${date?.toLocaleTimeString()}`;
    }
    clickedRole(event, role) {
        event.target.selected = true;
        if (role === this.state.role) {
            role = UserRole.none;
        }
        this.dispatchEvent(new UpdateUserRoleEvent(this.state.uid, role));
    }
};
UserCard.styles = [styles.types, css `
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
    `];
__decorate([
    property({ type: Object })
], UserCard.prototype, "state", void 0);
UserCard = __decorate([
    customElement('hb-user-card')
], UserCard);
export { UserCard };
