var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../../common/hb-button";
import "../../../common/hb-text-input";
import { PageTabsContentController, SelectTabEvent } from "./PageTabsContentController";
/**
 */
let PageTabsContent = class PageTabsContent extends LitElement {
    constructor() {
        super(...arguments);
        this.pathname = "";
        this.contentIndex = -1;
        this.pageTabsContent = new PageTabsContentController(this);
    }
    get stateId() { return this.pathname; }
    render() {
        const state = this.pageTabsContent.state;
        const contentState = this.pageTabsContent.contentState;
        return html `
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${!state.tabs || state.tabs.length === 0}>
                
                
                ${this.renderTabs(false)}


                <div slot="edit-toolbar">
                    <!-- NO TOOLBAR //-->
                </div>
                <div slot="page-edit-empty">
                    ${this.renderTabs(true)}
                </div>
                <div slot="content-edit">
                    ${this.renderTabs(true)}
                </div>
                <div slot="content-edit-tools">
                    <div class="edit-tools">
                        ${state.selectedTab ? html `
                            <div class="edit-tools-content">
                                <hb-text-input
                                    label="Tab name"
                                    value=${state.selectedTabName}
                                    helper-text=${state.selectedTabUrl}
                                ></hb-text-input>
                                <hb-button label="Add New Page"></hb-button>
                            </div>                        
                        ` : html ``}                        
                        <div class="edit-tools-buttons">
                            <hb-button text-button label="Edit Root Page"></hb-button>
                            <hb-button text-button label="Add New Tab"></hb-button>
                        </div>
                    </div>                    
                </div>
            </hb-page-content>
        `;
    }
    renderTabs(forEdit) {
        const state = this.pageTabsContent.state;
        if (!state.tabs) {
            return html ``;
        }
        const contentState = this.pageTabsContent.contentState;
        return html `
            <div class="tab-background">
                <div class="tab-container">
                ${state.tabs.map(tab => html `
                    <a
                        class="tab"
                        href=${forEdit ? "javascript:;" : tab.url}
                        ?selected=${tab.tabName === state.selectedTabName}
                        @click=${() => this.tabClicked(tab.tabName)}
                    >
                        ${tab.tabName}
                    </a>
                `)}
                </div>
            </div>
        `;
    }
    tabClicked(tabName) {
        this.dispatchEvent(new SelectTabEvent(tabName));
    }
};
PageTabsContent.styles = [css `
        :host {
            position: sticky;
            top: 0;
            display: block;
            z-index: 30;
            --hb-page-tabs-shape-corner: 40px;
            --hb-page-tabs-overflow: 1rem;
        }       
        .tab-background {
            position: relative;
            left: calc(-1* var(--hb-page-tabs-overflow));
            width: calc(100% + (var(--hb-page-tabs-overflow) * 2));
            background-color: var(--md-sys-color-background);
            border-radius: 0 0 var(--hb-page-tabs-shape-corner) var(--hb-page-tabs-shape-corner);
        }
        .tab-container {
            position: relative;
            top: 8px;                       
            display: flex;
            align-items: stretch;
            background-color: var(--md-sys-color-surface);
            border-radius: var(--hb-page-tabs-shape-corner);
        }

        .tab {
            flex-grow: 1;
            border-radius: var(--hb-page-tabs-shape-corner);
            line-height: 60px;
            text-align: center;
            color: var(--md-sys-color-on-surface);
            text-decoration: none;
        }
        .tab:hover {
            background-color: var(--md-sys-color-surface-variant);
            color: var(--md-sys-color-on-surface-variant);
        }
        .tab[selected] {
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
        }


        div[slot="content-edit-tools"] {
            margin-top: 4rem;
        }

        .edit-tools {
            display: flex;
            flex-direction: column;
            padding: 8px 16px;
        }
        .edit-tools-content {
            padding: 16px 32px 0;
            display: flex;
            gap: 12px;
            align-items: center;
        }
        .edit-tools-buttons {
            text-align: right;
        }
  `];
__decorate([
    property({ type: String })
], PageTabsContent.prototype, "pathname", void 0);
__decorate([
    property({ type: Number, attribute: "content-index" })
], PageTabsContent.prototype, "contentIndex", void 0);
__decorate([
    query("hb-page-content")
], PageTabsContent.prototype, "$hbPageContent", void 0);
PageTabsContent = __decorate([
    customElement('hb-page-tabs-content')
], PageTabsContent);
export { PageTabsContent };
