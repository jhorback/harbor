import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../styles";
import { RequestSysadminSettingsEvent, SystemAdminData, UpdateHomePageEvent } from "../data/hb-system-admin-data";
import { linkProp } from "@domx/linkprop";
import "../../common/hb-button";
import { AddDocumentDialog } from "../../doc/hb-add-document-dialog";
import { DocumentSelectedEvent, FindDocDialog } from "../../doc/hb-find-doc-dialog";
import "../../doc/hb-find-doc-dialog";
import { DocumentAddedEvent } from "../../doc/data/hb-add-document-data";
import "../../doc/hb-add-document-dialog";



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

    @query("hb-find-doc-dialog")
    $findDocDialog!:FindDocDialog;

    @query("hb-system-admin-data")
    $systemAdminData!:SystemAdminData;

    async connectedCallback() {
        super.connectedCallback();
        await this.updated;
        this.$systemAdminData.dispatchEvent(new RequestSysadminSettingsEvent());
    }

    render() {
        return html`
            <hb-system-admin-data
                @settings-changed=${linkProp(this, "settings")}
            ></hb-system-admin-data>
            <hb-add-document-dialog
                @document-added=${this.documentAdded}
            ></hb-add-document-dialog>
            <hb-find-doc-dialog
                @document-selected=${this.documentSelected}
            ></hb-find-doc-dialog>
            <div class="home-page-container">
                <div class="title-large">Home page</div>
                ${this.settings.homePageThumbnail ? html`

                   ${this.settings.homePageThumbnail.title}

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

    private documentAdded(event:DocumentAddedEvent) {
        this.$systemAdminData.dispatchEvent(new UpdateHomePageEvent(event.documentReference));
    }

    private documentSelected(event:DocumentSelectedEvent) {
        this.$systemAdminData.dispatchEvent(new UpdateHomePageEvent(event.documentReference));
    }

    private searchExistingHomePageClicked() {
        this.changeHomePage = false;
        this.$findDocDialog.open = true;
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
