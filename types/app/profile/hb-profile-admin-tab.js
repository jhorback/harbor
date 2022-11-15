var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../styles";
import { RequestSysadminSettingsEvent, SystemAdminData, UpdateHomePageEvent } from "../data/hb-system-admin-data";
import { linkProp } from "@domx/linkprop";
import "../../common/hb-button";
import "../../common/hb-horizontal-card";
import "../../doc/hb-find-doc-dialog";
/**
 * @class ProfileAdminTab
 */
let ProfileAdminTab = class ProfileAdminTab extends LitElement {
    constructor() {
        super(...arguments);
        this.settings = SystemAdminData.defaultSettings;
        this.changeHomePage = false;
    }
    async connectedCallback() {
        super.connectedCallback();
        await this.updated;
        this.$systemAdminData.dispatchEvent(new RequestSysadminSettingsEvent());
    }
    render() {
        return html `
            <hb-system-admin-data
                @settings-changed=${linkProp(this, "settings")}
            ></hb-system-admin-data>
            <hb-add-page-dialog
                @page-added=${this.pageAdded}
            ></hb-add-page-dialog>
            <hb-find-doc-dialog
                @document-selected=${this.documentSelected}
            ></hb-find-doc-dialog>
            <div class="home-page-container">
                <div class="title-large">Home page</div>
                ${this.settings.homePageThumbnail ? html `

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
    changeHomePageClicked() {
        this.changeHomePage = !this.changeHomePage;
    }
    addNewHomePageClicked() {
        this.changeHomePage = false;
        this.$addPageDialog.showModal();
    }
    pageAdded(event) {
        this.$systemAdminData.dispatchEvent(new UpdateHomePageEvent(event.docModel.toDocumentReference()));
    }
    documentSelected(event) {
        this.$systemAdminData.dispatchEvent(new UpdateHomePageEvent(event.documentReference));
    }
    searchExistingHomePageClicked() {
        this.changeHomePage = false;
        this.$findDocDialog.open = true;
    }
};
ProfileAdminTab.styles = [styles.types, css `
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
    `];
__decorate([
    property({ type: Object })
], ProfileAdminTab.prototype, "settings", void 0);
__decorate([
    state()
], ProfileAdminTab.prototype, "changeHomePage", void 0);
__decorate([
    query("hb-add-page-dialog")
], ProfileAdminTab.prototype, "$addPageDialog", void 0);
__decorate([
    query("hb-find-doc-dialog")
], ProfileAdminTab.prototype, "$findDocDialog", void 0);
__decorate([
    query("hb-system-admin-data")
], ProfileAdminTab.prototype, "$systemAdminData", void 0);
ProfileAdminTab = __decorate([
    customElement('hb-profile-admin-tab')
], ProfileAdminTab);
export { ProfileAdminTab };
