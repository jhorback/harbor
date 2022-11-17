import { linkProp } from "@domx/linkprop";
import { css, html, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import "../../common/hb-button";
import "../../common/hb-horizontal-card";
import { AddPageDialog, PageAddedEvent } from "../../pages/hb-add-page-dialog";
import { FindPageDialog, PageSelectedEvent } from "../../pages/hb-find-page-dialog";
import { styles } from "../../styles";
import { RequestSysadminSettingsEvent, SystemAdminData, UpdateHomePageEvent } from "../data/hb-system-admin-data";



/**
 * @class ProfileAdminTab
 */
@customElement('hb-profile-admin-tab')
export class ProfileAdminTab extends LitElement {

    @property({type: Object})
    settings = SystemAdminData.defaultSettings;

    @state()
    changeHomePage = false;

    @query("hb-add-page-dialog")
    $addPageDialog!:AddPageDialog;

    @query("hb-find-page-dialog")
    $findPageDialog!:FindPageDialog;

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
            <hb-add-page-dialog
                @page-added=${this.pageAdded}
            ></hb-add-page-dialog>
            <hb-find-page-dialog
                @page-selected=${this.pageSelected}
            ></hb-find-page-dialog>
            <div class="home-page-container">
                <div class="title-large">Home page</div>
                ${this.settings.homePageThumbnail ? html`

                    <hb-horizontal-card
                        class="home-page-thumb"
                        text=${this.settings.homePageThumbnail.title}
                        description=${this.settings.homePageThumbnail.thumbDescription}
                        media-url=${this.settings.homePageThumbnail.thumbUrl}
                        media-href="/"
                    ></hb-horizontal-card>                   

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
        this.$addPageDialog.showModal();
    }

    private pageAdded(event:PageAddedEvent) {
        this.$systemAdminData.dispatchEvent(new UpdateHomePageEvent(event.pageModel.toPageReference()));
    }

    private pageSelected(event:PageSelectedEvent) {
        this.$systemAdminData.dispatchEvent(new UpdateHomePageEvent(event.pageReference));
    }

    private searchExistingHomePageClicked() {
        this.changeHomePage = false;
        this.$findPageDialog.showModal();
    }

    static styles = [styles.types, css`
        :host {
            display: block; 
        }
        .home-page-thumb {
            max-width: 300px;
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
