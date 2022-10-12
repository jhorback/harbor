var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { HbApp } from "../domain/HbApp";
import { CurrentUserData } from "../hb-current-user-data";
import { linkProp } from "@domx/linkprop";
import { styles } from "../styles";
import "../layout/hb-page-layout";
import "../common/hb-link-button";
import "../common/hb-switch";
/**
 * @class ProfilePage
 */
let AboutPage = class AboutPage extends LitElement {
    constructor() {
        super(...arguments);
        this.hbAppInfo = CurrentUserData.defaultHbAppInfo;
        this.darkTheme = false;
    }
    connectedCallback() {
        super.connectedCallback();
        this.darkTheme = HbApp.theme === "dark";
    }
    render() {
        return html `
<hb-current-user-data
    @hb-app-info-changed=${linkProp(this, "hbAppInfo")}
></hb-current-user-data>
<hb-page-layout small>
    <div class="headline-large">About Harbor
        <span class="primary-text">${this.hbAppInfo.version}</span>
    </div>
    <div class="theme-switcher">
        <hb-switch
            ?selected=${this.darkTheme}
            @hb-switch-change=${this.toggleTheme}
        ></hb-switch>
        <div class="label-large">Dark Theme</div>
    </div>
    <!-- <hr> -->
    <div class="body-large text-content">
        <p>
            Habor is a web application that can be used to configure and display
            simple content based websites.
        </p>
        <p>
            The version of this application is <span class="primary-text">${this.hbAppInfo.version}</span>. The Changelog
            shows changes over previous versions including unreleased
            changes.
        </p>
        <p>
            To see features planned for the future, see the Habor project board.
        </p>
        <p>
            Feature requests and bugs can be added through Github issues.
        </p>
    </div>
    <hr>
    <div class="button-container">
        <hb-link-button
            label="Changelog"
            href="https://github.com/jhorback/harbor/blob/develop/CHANGELOG.md"
            target="changelog">
        </hb-link-button>
        <hb-link-button
            label="Project board"
            href="https://github.com/users/jhorback/projects/1"
            target="project">
        </hb-link-button>
        <hb-link-button
            label="Issues"
            href="https://github.com/jhorback/harbor/issues"
            target="issues">
        </hb-link-button>
    </div>
</hb-page-layout>
        `;
    }
    toggleTheme() {
        HbApp.toggleTheme();
        this.darkTheme = HbApp.theme === "dark";
    }
};
AboutPage.styles = [styles.types, css `
        :host {
            display: block;
        }
        .headline-large {            
            padding-top: 2rem;
            
        }        
        .theme-switcher {
            display:flex;
            gap: 20px;
            margin: 2rem 0 0 0;
            align-items: center;
        }
        hr {
            border-color: var(--md-sys-color-outline);
        }
        .text-content {
            padding: 2rem 0;
        }
        p {
            padding: 0.5rem 0;
            max-width: 60ch;
        }
        .button-container {
            display: flex;
            gap: 25px;
            justify-content: left;
            padding: 1rem 0;
        }
    `];
__decorate([
    property({ type: Object })
], AboutPage.prototype, "hbAppInfo", void 0);
__decorate([
    property({ type: Boolean })
], AboutPage.prototype, "darkTheme", void 0);
AboutPage = __decorate([
    customElement('hb-about-page')
], AboutPage);
export { AboutPage };
