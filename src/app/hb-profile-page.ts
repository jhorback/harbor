import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { AvatarSize } from "../common/hb-avatar";
import "../layout/hb-page-layout";
import "../common/tabs/hb-link-tab";
import "../common/tabs/hb-tab-bar";
import { styles } from "../styles";


/**
 * @class ProfilePage
 */
@customElement('hb-profile-page')
export class ProfilePage extends LitElement {

    render() {
        return html`
<hb-page-layout>
    <div class="page-container">
        <div class="header">
            <hb-avatar size=${AvatarSize.large} href="content/avatars/user1.png"></hb-avatar>
            <div>
                <div class="headline-large">John Horback</div>
                <div class="body-large">jhorback@gmail.com</div>
            </div>
        </div>
        <hb-tab-bar selected-tab="documents-tab">
            <hb-link-tab
                id="documents-tab"
                label="Documents"
                href="/profile/docs">
            </hb-link-tab>
            <hb-link-tab
                id="content-tab"
                label="Content"
                href="/profile/content">
            </hb-link-tab>
            <hb-link-tab
                id="users-tab"
                label="Users"
                href="/profile/users">
            </hb-link-tab>
            <hb-link-tab
                id="admin-tab"
                label="Admin"
                href="/profile/admin">
            </hb-link-tab>
        </hb-tab-bar>
        <div class="tab-content-container">
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
            <p>Content Here</p>
        </div>
    </div>
</hb-page-layout>
        `;
    }

    static styles = [styles.types, css`
        :host {
            display: block;
        }
        .page-container {            
            max-width: 840px;
            margin: auto;
            padding: 1rem;
        }
        .header {
            display: flex;
            gap: 20px;
            margin-bottom: 1rem;
        }
        .tab-content-container {
            padding: 1rem;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-profile-page': ProfilePage
  }
}
