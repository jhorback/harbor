var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import { linkProp } from "@domx/linkprop";
import { UserData } from "../../app/data/hb-user-data";
import { AvatarSize } from "../../common/hb-avatar";
/**
 */
let PageAuthorSettings = class PageAuthorSettings extends LitElement {
    constructor() {
        super(...arguments);
        this.uid = "";
        this.state = UserData.defaultState;
    }
    render() {
        return html `
            <hb-user-data
                uid=${this.uid}
                @state-changed=${linkProp(this, "state")}
            ></hb-user-data>
            <div class="author">
                <hb-avatar size=${AvatarSize.medium} href=${this.state.user.photoURL}></hb-avatar>
                <div>
                    <div class="headline-small">${this.state.user.displayName}</div>
                    <div class="body-medium">${this.state.user.email}</div>
                    <div class="body-medium">Last login: ${this.state.user.lastLogin?.toLocaleDateString()}</div>
                </div>
            </div>
        `;
    }
};
PageAuthorSettings.styles = [styles.types, styles.dialog, css `
        :host {
            display: block;
        }
        .author {
            display: flex;
            gap: 20px;
            margin-bottom: 1rem;
        }
        .body-medium {
            margin-bottom: 2px;
        }
  `];
__decorate([
    property({ type: String })
], PageAuthorSettings.prototype, "uid", void 0);
__decorate([
    property({ type: Object })
], PageAuthorSettings.prototype, "state", void 0);
PageAuthorSettings = __decorate([
    customElement('hb-page-author-settings')
], PageAuthorSettings);
export { PageAuthorSettings };
