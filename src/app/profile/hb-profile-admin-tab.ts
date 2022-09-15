import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { styles } from "../../styles";
import { ISystemAdminData } from "../../domain/SystemAdmin/hb-system-admin-data";
import { linkProp } from "@domx/linkprop";
import "../../common/hb-button";


/**
 * // todo: home page dialogs
 * 
 * 
 * Both dialogs can return a value that can be used in the "set-home-page" event
 * 
 * Add Document Dialog
 * state: {
 *      docTypes: Array<IDocumentTypeDescriptor>
 * }
 * Handled Events:
 *  * add-document
 * 
 * Search Document Dialog
 * state: {
 *      results: {
 *          count:
 *          list?:
 *      }
 * }
 * 
 */


/**
 * @class ProfileAdminTab
 */
@customElement('hb-profile-admin-tab')
export class ProfileAdminTab extends LitElement {

    @property({type: Object})
    settings!:ISystemAdminData;

    @state()
    changeHomePage = false;

    render() {
        return html`
            <hb-system-admin-data
                @settings-changed=${linkProp(this, "settings")}
            ></hb-system-admin-data>
            <div class="home-page-container">
                <div class="title-large">Home page</div>
                ${this.settings?.homePageThumbnail ? html`

                    HAVE THUMBNAIL!!!

                ` : html `
                    <div class="body-large">
                        The home page has not been set
                    </div>
                `}
                <div class="button-container">
                    <hb-button
                        label="Change the Home Page"
                        ?selected=${this.changeHomePage}
                        @click=${this.changeHomePageClicked}
                    ></hb-button>
                    <hb-button
                        label="Add New"
                        ?hidden=${!this.changeHomePage}
                        @click=${this.addNewHomePageClicked}
                    ></hb-button>
                    <hb-button
                        label="Search Existing"
                        ?hidden=${!this.changeHomePage}
                        @click=${this.searchExistingHomePageClicked}
                    ></hb-button>
                </div>
            </div>
        `;
    }

    private changeHomePageClicked() {
        this.changeHomePage = !this.changeHomePage;
    }

    private addNewHomePageClicked() {
        this.changeHomePage = false;
        alert("ADD NEW");
    }

    private searchExistingHomePageClicked() {
        this.changeHomePage = false;
        alert("SEARCH EXISTING");
    }

    static styles = [styles.types, css`
        :host {
            display: block; 
        }
        .home-page-container {
            margin-top: 2rem;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
        .button-container {
            display: flex;
            gap: 1rem;
        }
        [hidden] {
            display: none;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-profile-admin-tab': ProfileAdminTab
  }
}
