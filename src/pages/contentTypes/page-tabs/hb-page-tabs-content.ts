import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { debounce } from "../../../common/debounce";
import { DragOrderController } from "../../../common/DragOrderController";
import "../../../common/hb-button";
import "../../../common/hb-text-input";
import { TextInputChangeEvent } from "../../../common/hb-text-input";
import { styles } from "../../../styles";
import { HbPageContent } from "../../hb-page";
import { AddNewPageEvent, AddNewTabEvent, DeleteSelectedPageEvent, DeleteSelectedTabEvent, PageTabsContentController, SaveTabsEvent, SelectedTabNameChanged, SelectPageTemplateEvent, SelectTabEvent } from "./PageTabsContentController";

/**
 */
@customElement('hb-page-tabs-content')
export class PageTabsContent extends LitElement {

    get stateId() { return this.pathname; }

    @property({type:String})
    pathname:string = "";

    @property({type:Number, attribute: "content-index"})
    contentIndex:number = -1;

    pageTabsContent:PageTabsContentController = new PageTabsContentController(this);
    dragOrderController:DragOrderController = new DragOrderController(this);

    @query("hb-page-content")
    $hbPageContent!:HbPageContent; 

    @query("[slot=content-edit] .tab-container")
    $tabContainer!:Element;

    render() {
        const state = this.pageTabsContent.state;
        const contentState = this.pageTabsContent.contentState;
        return html`
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
                        ${state.isOnRootPage ? html`
                            <p>You are editing the root page. Normally this page cannot be navigated to directly.</p>
                        ` : html``}
                    </div>
                </div>
                <div slot="content-edit-tools">
                    <div class="edit-tools">
                        ${state.selectedTab ? html`
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
                                <div class="edit-tools-page-type">
                                    <label for="pageTemplate" class="label-large">Page type</label>
                                    <select id="pageTemplate" @change=${this.selectedPageTemplateChange} class="large">
                                        ${state.pageTemplates.map(template => html`
                                            <option value=${template.key}>${template.name}</option>
                                        `)}
                                    </select>
                                </div>
                                ${state.selectedTab.url ? html`
                                    <hb-button
                                        text-button
                                        label="Delete Selected Page"
                                        @click=${this.deleteSelectedPage}
                                    ></hb-button>
                                ` : html`
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
                        ` : html``}                        
                        <div class="edit-tools-buttons">
                            ${state.isOnRootPage ? html`` : html`
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
                            ${!state.isDirty ? html`` : html`
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

    renderTabs(forEdit:boolean) {
        const state = this.pageTabsContent.state;
        if (!state.tabs) {
            return html``;
        }

        const contentState = this.pageTabsContent.contentState;
        return html`
            <div class="tab-background">
                <div class="tab-container">
                ${state.tabs.map((tab, index) => html`
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

    tabClicked(index:number) {
        this.dispatchEvent(new SelectTabEvent(index));
    }

    selectedTabNameChange(event:TextInputChangeEvent) {
        this.dispatchEvent(new SelectedTabNameChanged(event.value));
    }

    addNewPage(event:Event) {
        this.dispatchEvent(new AddNewPageEvent());
    }

    deleteSelectedPage(event:Event) {
        this.dispatchEvent(new DeleteSelectedPageEvent());
    }

    deleteSelectedTab(event:Event) {
        this.dispatchEvent(new DeleteSelectedTabEvent());
    }
    
    addNewTab(event:Event) {
        this.dispatchEvent(new AddNewTabEvent());
    }

    selectedPageTemplateChange(event:Event) {
        const templateKey = (event.target as HTMLSelectElement).value as string;
        this.dispatchEvent(new SelectPageTemplateEvent(templateKey));
    }
    
    saveChanges(event:Event) {
        this.dispatchEvent(new SaveTabsEvent());
    }

    editRootPage(event:Event) {
        alert("Edit Root Page");
    }
   
    static styles = [styles.types, styles.form, css`
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
  `];
}




declare global {
    interface HTMLElementTagNameMap {
        'hb-page-tabs-content': PageTabsContent
    }
}
