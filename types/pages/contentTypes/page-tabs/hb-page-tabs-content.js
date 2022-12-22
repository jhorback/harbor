var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { debounce } from "../../../common/debounce";
import { DragOrderController } from "../../../common/DragOrderController";
import "../../../common/hb-button";
import "../../../common/hb-text-input";
import { styles } from "../../../styles";
import { AddNewPageEvent, AddNewTabEvent, DeleteSelectedTabEvent, PageTabsContentController, SaveTabsEvent, SelectedTabNameChanged, SelectPageTemplateEvent, SelectTabEvent } from "./PageTabsContentController";
import "../../hb-delete-page-dialog";
import { ifDefined } from "lit-html/directives/if-defined.js";
/**
 */
let PageTabsContent = class PageTabsContent extends LitElement {
    constructor() {
        super(...arguments);
        this.pathname = "";
        this.contentIndex = -1;
        this.pageTabsContent = new PageTabsContentController(this);
        this.dragOrderController = new DragOrderController(this);
    }
    get stateId() { return this.pathname; }
    render() {
        const state = this.pageTabsContent.state;
        const contentState = this.pageTabsContent.contentState;
        return html `
            <hb-delete-page-dialog
                uid=${ifDefined(state.selectedTab?.pageUid)}
                @page-deleted=${this.deleteSelectedTab}
            ></hb-delete-page-dialog>
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
                    <div class="content-edit-message">
                        <p>Select a tab to create (or delete a page); drag a tab to reorder.</p>
                        ${state.isOnRootPage ? html `
                            <p>You are editing the root page. Normally this page cannot be navigated to directly.</p>
                        ` : html ``}
                    </div>
                </div>
                <div slot="content-edit-tools">
                    <div class="edit-tools">
                        ${state.selectedTab ? html `
                            <div class="edit-tools-content">
                                <hb-text-input
                                    label="Tab name"
                                    value=${state.selectedTab.tabName}
                                    helper-text=${state.selectedTabUrl}
                                    error-text=${state.addPageError}
                                    ?readonly=${state.selectedTab.url ? true : false}
                                    autofocus
                                    @hb-text-input-change=${debounce(this.selectedTabNameChange, 700)}
                                ></hb-text-input>
                                ${state.selectedTab.url ? html `` : html `
                                    <div class="edit-tools-page-type">
                                        <label for="pageTemplate" class="label-large">Page type</label>
                                        <select id="pageTemplate" @change=${this.selectedPageTemplateChange} class="large">
                                            ${state.pageTemplates.map(template => html `
                                                <option value=${template.key}>${template.name}</option>
                                            `)}
                                        </select>
                                    </div>
                                `}                                
                                ${state.selectedTab.url ? html `
                                    <hb-button
                                        text-button
                                        label="Delete Selected Page"
                                        @click=${this.deleteSelectedPage}
                                    ></hb-button>
                                ` : html `
                                    <hb-button
                                        label="Add New Page"
                                        @click=${this.addNewPage}
                                    ></hb-button>
                                    <hb-button
                                        text-button
                                        label="Delete Selected Tab"
                                        @click=${this.deleteSelectedTab}
                                    ></hb-button>
                                `}
                                
                            </div>                        
                        ` : html ``}                        
                        <div class="edit-tools-buttons">
                            ${state.isOnRootPage ? html `` : html `
                                <hb-link-button
                                    text-button
                                    label="Edit Root Page"
                                    href=${state.rootPageUrl}
                                ></hb-link-button>
                            `}                            
                            <hb-button
                                text-button
                                label="Add New Tab"
                                @click=${this.addNewTab}
                            ></hb-button>
                            ${!state.isDirty ? html `` : html `
                                <hb-button
                                    tonal
                                    label="Save Changes"
                                    @click=${this.saveChanges}
                                ></hb-button>
                            `}
                        </div>
                    </div>                    
                </div>
            </hb-page-content>
        `;
    }
    updated() {
        this.pageTabsContent.contentState.inContentEditMode ?
            this.dragOrderController.attach(this.$tabContainer) :
            this.dragOrderController.detach();
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
                ${state.tabs.map((tab, index) => html `
                    <a class="tab"
                        href=${forEdit ? "javascript:;" : tab.url}
                        ?selected=${index === state.selectedTabIndex}
                        @click=${() => this.tabClicked(index)}
                    >${tab.tabName}</a>
                `)}
                </div>
            </div>
        `;
    }
    tabClicked(index) {
        this.dispatchEvent(new SelectTabEvent(index));
    }
    selectedTabNameChange(event) {
        this.dispatchEvent(new SelectedTabNameChanged(event.value));
    }
    addNewPage(event) {
        this.dispatchEvent(new AddNewPageEvent());
    }
    deleteSelectedPage(event) {
        this.$deletePageDialog.showModal();
    }
    deleteSelectedTab(event) {
        this.dispatchEvent(new DeleteSelectedTabEvent());
    }
    addNewTab(event) {
        this.dispatchEvent(new AddNewTabEvent());
    }
    selectedPageTemplateChange(event) {
        const templateKey = event.target.value;
        this.dispatchEvent(new SelectPageTemplateEvent(templateKey));
    }
    saveChanges(event) {
        this.dispatchEvent(new SaveTabsEvent());
    }
    static { this.styles = [styles.types, styles.form, css `
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
            max-width: 100%;
            overflow-x: auto;
            scrollbar-width: thin;
        }
        .tab-container::-webkit-scrollbar,
        .tab-container::-webkit-scrollbar-track,
        .tab-container::-webkit-scrollbar-thumb {
            height: 1px;
            background: transparent;
        }
        .tab {
            flex-grow: 1;
            border-radius: var(--hb-page-tabs-shape-corner);
            line-height: 60px;
            text-align: center;
            color: var(--md-sys-color-on-surface);
            text-decoration: none;
            white-space: nowrap;
            padding: 0 24px;
        }
        .tab:hover {
            background-color: var(--md-sys-color-surface-variant);
            color: var(--md-sys-color-on-surface-variant);
        }
        .tab[selected] {
            background-color: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
        }

        .content-edit-message {
            margin: 2rem 1rem;
            padding-left: 1rem;
            opacity: 0.8;
            border-left: 5px solid var(--md-sys-color-outline);
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
        .edit-tools-page-type {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding-bottom: 20px;
        }
        .edit-tools-buttons {
            text-align: right;
        }
  `]; }
};
__decorate([
    property({ type: String })
], PageTabsContent.prototype, "pathname", void 0);
__decorate([
    property({ type: Number, attribute: "content-index" })
], PageTabsContent.prototype, "contentIndex", void 0);
__decorate([
    query("hb-page-content")
], PageTabsContent.prototype, "$hbPageContent", void 0);
__decorate([
    query("[slot=content-edit] .tab-container")
], PageTabsContent.prototype, "$tabContainer", void 0);
__decorate([
    query("hb-delete-page-dialog")
], PageTabsContent.prototype, "$deletePageDialog", void 0);
PageTabsContent = __decorate([
    customElement('hb-page-tabs-content')
], PageTabsContent);
export { PageTabsContent };
