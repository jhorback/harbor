var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { styles } from "../../styles";
import { linkProp } from "@domx/linkprop";
import "../../common/hb-button";
import "../../doc/hb-add-document-dialog";
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
let ProfileAdminTab = class ProfileAdminTab extends LitElement {
    constructor() {
        super(...arguments);
        this.changeHomePage = false;
    }
    render() {
        return html `
            <hb-system-admin-data
                @settings-changed=${linkProp(this, "settings")}
            ></hb-system-admin-data>
            <hb-add-document-dialog open></hb-add-document-dialog>
            <div class="home-page-container">
                <div class="title-large">Home page</div>
                ${this.settings?.homePageThumbnail ? html `

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
    changeHomePageClicked() {
        this.changeHomePage = !this.changeHomePage;
    }
    addNewHomePageClicked() {
        this.changeHomePage = false;
        this.$addDocumentDialog.open = true;
    }
    searchExistingHomePageClicked() {
        this.changeHomePage = false;
        alert("SEARCH EXISTING");
    }
};
ProfileAdminTab.styles = [styles.types, css `
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
    `];
__decorate([
    property({ type: Object })
], ProfileAdminTab.prototype, "settings", void 0);
__decorate([
    state()
], ProfileAdminTab.prototype, "changeHomePage", void 0);
__decorate([
    query("hb-add-document-dialog")
], ProfileAdminTab.prototype, "$addDocumentDialog", void 0);
ProfileAdminTab = __decorate([
    customElement('hb-profile-admin-tab')
], ProfileAdminTab);
export { ProfileAdminTab };
