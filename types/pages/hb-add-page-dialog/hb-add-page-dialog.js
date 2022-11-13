var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { styles } from "../../styles";
import "../../common/hb-button";
import "../../common/hb-list-item";
import "../../common/hb-text-input";
import { AddNewPageEvent, AddPageController, AddPageOptionsChangedEvent } from "./AddPageController";
/**
 * @fires {@link PageAddedEvent}
 */
let AddPageDialog = class AddPageDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.addPage = new AddPageController(this);
        this.selectedIndex = 0;
        this.addButtonEnabled = false;
    }
    render() {
        const state = this.addPage.state;
        return html `
            <dialog @cancel=${this.close}>
                
                <h1 class="headline-small">Add New Page</h1>

                <div>${state.pageIsValidMessage}</div>

                <div class="field">            
                    <div class="label-large">Page type</div>
                    <div class="list">
                        ${state.pageTemplates.map((template, index) => html `
                            <hb-list-item
                                icon=${template.icon}
                                text=${template.name}
                                description=${template.description}
                                ?selected=${this.isSelected(index)}                                    
                                @hb-list-item-click=${() => this.selectedIndex = index}
                            ></hb-list-item>
                        `)}
                    </div>
                </div>
                <hr>
                <div class="field">
                    <div class="label-large">Page name</div>
                    <hb-text-input
                        placeholder="Enter the page title"
                        value=${state.title}
                        @hb-text-input-change=${this.titleInputChange}
                    ></hb-text-input>
                </div>
                <div class="field">
                    <div class="label-large">Page URL</div>
                    <hb-text-input
                        placeholder="Enter the page URL"
                        value=${state.pathname}
                        error-text=${state.addPageError}
                        @hb-text-input-change=${this.pathnameInputChange}
                    ></hb-text-input>
                    <hb-button
                        text-button
                        label="Check"
                        @click=${this.validateButtonClicked}
                    ></hb-button>
                </div>
                <div class="dialog-buttons">
                    <hb-button
                        text-button
                        label="Cancel"
                        @click=${this.close}
                    ></hb-button>
                    <hb-button
                        text-button
                        label="Add Page"
                        ?disabled=${!this.addButtonEnabled}
                        @click=${this.addButtonClicked}
                    ></hb-button>
                </div>                
            </dialog>
        `;
    }
    showModal() {
        this.$dialog.showModal();
    }
    close() {
        this.reset();
        this.$dialog.close();
    }
    reset() {
        this.addButtonEnabled = false;
        this.selectedIndex = 0;
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: "",
            title: "",
            pathname: ""
        }, false));
    }
    isSelected(index) {
        return index === this.selectedIndex;
    }
    titleInputChange(event) {
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: "",
            pathname: "",
            title: event.value
        }, false));
        if (this.addPage.state.canAdd && event.enterKey) {
            this.addButtonClicked();
        }
    }
    pathnameInputChange(event) {
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: "",
            pathname: event.value,
            title: ""
        }, false));
        if (this.addPage.state.canAdd && event.enterKey) {
            this.addButtonClicked();
        }
    }
    validateButtonClicked() {
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: this.addPage.state.pageTemplates[this.selectedIndex].key,
            title: this.addPage.state.title,
            pathname: this.addPage.state.pathname
        }, true));
    }
    addButtonClicked() {
        this.dispatchEvent(new AddNewPageEvent({
            pageTemplate: this.addPage.state.pageTemplates[this.selectedIndex].key,
            title: this.addPage.state.title,
            pathname: this.addPage.state.pathname
        }));
    }
};
AddPageDialog.styles = [styles.types, styles.dialog, css `
        :host {
            display: block;
            z-index:1;
        }

        .field {
            margin: 1rem 0;
            padding: 1rem 0;
            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }

        .list {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
  `];
__decorate([
    query("dialog")
], AddPageDialog.prototype, "$dialog", void 0);
__decorate([
    state()
], AddPageDialog.prototype, "selectedIndex", void 0);
__decorate([
    state()
], AddPageDialog.prototype, "addButtonEnabled", void 0);
AddPageDialog = __decorate([
    customElement('hb-add-page-dialog')
], AddPageDialog);
export { AddPageDialog };
