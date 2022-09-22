import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../styles";
import {SystemAdminData } from "../data/hb-system-admin-data";
import { linkProp } from "@domx/linkprop";
import "../../common/hb-button";
import "../../doc/hb-add-document-dialog";
import { AddDocumentDialog } from "../../doc/hb-add-document-dialog";
import { IDocumentReference } from "../../domain/interfaces/DocumentInterfaces";


/**
 * // todo: Search Document Dialog
 * state: {
 *      results: {
 *          count:
 *          list?:
 *      }
 * }
 */


/**
 * @class ProfileAdminTab
 */
@customElement('hb-profile-admin-tab')
export class ProfileAdminTab extends LitElement {

    @property({type: Object})
    settings = SystemAdminData.defaultSettings;

    @state()
    changeHomePage = false;

    @query("hb-add-document-dialog")
    $addDocumentDialog!:AddDocumentDialog;

    @query("hb-system-admin-data")
    $systemAdminData!:SystemAdminData;

    async connectedCallback() {
        super.connectedCallback();
        await this.updated;
        this.$systemAdminData.dispatchEvent(SystemAdminData.requestSysadminSettingsEvent());
    }

    render() {
        return html`
            <hb-system-admin-data
                @settings-changed=${linkProp(this, "settings")}
            ></hb-system-admin-data>
            <hb-add-document-dialog
                @document-added=${this.documentAdded}
            ></hb-add-document-dialog>
            <div class="home-page-container">
                <div class="title-large">Home page</div>
                ${this.settings.homePageThumbnail ? html`

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
       this.$addDocumentDialog.open = true;
    }

    private documentAdded(event:CustomEvent) {
        var docRef = event.detail as IDocumentReference;
        this.$systemAdminData.dispatchEvent(SystemAdminData.updateHomePageEvent(docRef));
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
