import { linkProp } from "@domx/linkprop";
import { css, html, LitElement } from "lit";
import { customElement, query, state } from "lit/decorators.js";
import { TextInputChangeEvent } from "../../common/hb-text-input";
import { styles } from "../../styles";
import "../../common/hb-button";
import "../../common/hb-list-item";
import "../../common/hb-text-input";
import { AddNewPageEvent, AddPageController, AddPageOptionsChangedEvent } from "./AddPageController";
import { PageAddedEvent } from "./AddPageController";



/**  
 * @fires {@link PageAddedEvent}
 */
@customElement('hb-add-page-dialog')
export class AddPageDialog extends LitElement {

    @query("dialog")
    $dialog!:HTMLDialogElement;

    addPage:AddPageController = new AddPageController(this);

    @state()
    selectedIndex = 0;

    @state()
    addButtonEnabled = false;

    render() {
        const state = this.addPage.state;
        return html`
            <dialog @cancel=${this.close}>
                
                <h1 class="headline-small">Add New Page</h1>

                <div>${state.pageIsValidMessage}</div>

                <div class="field">            
                    <div class="label-large">Page type</div>
                    <div class="list">
                        ${state.pageTemplates.map((template, index) => html`
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
        `
    }

    showModal() {
        this.$dialog.showModal();
    }

    close () {
        this.reset();
        this.$dialog.close();
    }

    private reset() {
        this.addButtonEnabled = false;
        this.selectedIndex = 0;
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: "",
            title:"",
            pathname: ""
        }, false));
    }

    private isSelected(index:number) {
        return index === this.selectedIndex;
    }

    private titleInputChange(event:TextInputChangeEvent) {
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: "",
            pathname: "",
            title: event.value
        }, false));

        if (this.addPage.state.canAdd && event.enterKey) {
            this.addButtonClicked();
        }
    }

    private pathnameInputChange(event:TextInputChangeEvent) {
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: "",
            pathname: event.value,
            title: ""
        }, false));

        if (this.addPage.state.canAdd && event.enterKey) {
            this.addButtonClicked();
        }
    }

    private validateButtonClicked() {
        this.dispatchEvent(new AddPageOptionsChangedEvent({
            pageTemplate: this.addPage.state.pageTemplates[this.selectedIndex].key,
            title: this.addPage.state.title,
            pathname: this.addPage.state.pathname
        }, true));
    }

    private addButtonClicked() {
        this.dispatchEvent(new AddNewPageEvent({
            pageTemplate: this.addPage.state.pageTemplates[this.selectedIndex].key,
            title: this.addPage.state.title,
            pathname: this.addPage.state.pathname
        }));
    }

    static styles = [styles.types, styles.dialog, css`
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
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-add-page-dialog': AddPageDialog
  }
}
