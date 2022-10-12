import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../styles";
import { linkProp } from "@domx/linkprop";
import { UserData } from "../app/data/hb-user-data";
import { AvatarSize } from "../common/hb-avatar";





/**  
 * @fires {@link DocumentSelectedEvent}
 */
@customElement('hb-doc-author')
export class DocAuthor extends LitElement {

    @property({type:String})
    uid = "";

    @property({type: Object})
    state = UserData.defaultState;

    render() {
        return html`
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

    static styles = [styles.types, styles.dialog, css`
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
  `]
}



declare global {
  interface HTMLElementTagNameMap {
    'hb-doc-author': DocAuthor
  }
}
