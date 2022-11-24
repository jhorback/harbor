import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../common/hb-button";
import "../../common/hb-list-item";
import "../../common/hb-text-input";
import { TextInputChangeEvent } from "../../common/hb-text-input";
import { styles } from "../../styles";
import { AddNewPageEvent, AddPageController, PageAddedEvent, PagePathnameChangedEvent, PageTemplateChangedEvent, PageTitleChangedEvent, ValidateNewPageOptionsEvent } from "./AddPageController";



/**  
 * @fires {@link PageAddedEvent}
 */
@customElement('hb-add-page-dialog')
export class AddPageDialog extends LitElement {

    @property({type: String, attribute: "url-prefix"})
    urlPrefix:string = "";

    @query("dialog")
    $dialog!:HTMLDialogElement;

    addPage:AddPageController = new AddPageController(this);

    render() {
        const state = this.addPage.state;
        return html`
            <dialog @cancel=${this.close}>
                
                <h1 class="headline-small">Add New Page</h1>

                <div class="field">            
                    <div class="label-large">Page type</div>
                    <div class="list">
                        ${state.pageTemplates.map((template, index) => html`
                            <hb-list-item
                                icon=${template.icon}
                                text=${template.name}
                                description=${template.description}
                                ?selected=${state.pageTemplateIndex === index}                                    
                                @hb-list-item-click=${() => this.pageTemplateClicked(index)}
                            ></hb-list-item>
                        `)}
                    </div>
                </div>
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
                        error-text=${state.pagePathnameError}
                        @hb-text-input-change=${this.pathnameInputChange}
                    ></hb-text-input>
                    <div class="check-btn-ctr">
                        <hb-button
                            text-button
                            label="Check URL"
                            @click=${this.validateButtonClicked}
                        ></hb-button>
                    </div>
                    ${state.pageIsValidMessage ? html`
                        <div class="valid-message label-large">${state.pageIsValidMessage}</div>      
                    ` : html``}
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
                        ?disabled=${!state.canAdd}
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
        this.dispatchEvent(new PageTitleChangedEvent(""));
    }

    private pageTemplateClicked(index:number) {
        this.dispatchEvent(new PageTemplateChangedEvent(index));
    }

    private titleInputChange(event:TextInputChangeEvent) {
        this.dispatchEvent(new PageTitleChangedEvent(event.value));
        if (this.addPage.state.canAdd && event.enterKey) {
            this.addButtonClicked();
        }
    }

    private pathnameInputChange(event:TextInputChangeEvent) {
        this.dispatchEvent(new PagePathnameChangedEvent(event.value));
        if (this.addPage.state.canAdd && event.enterKey) {
            this.addButtonClicked();
        }
    }

    private validateButtonClicked() {
        this.dispatchEvent(new ValidateNewPageOptionsEvent());
    }

    private addButtonClicked() {
        this.dispatchEvent(new AddNewPageEvent());
        this.close();
    }

    static styles = [styles.types, styles.dialog, css`
        :host {
            display: block;
            z-index:1;
        }

        .list {
            display: flex;
            flex-direction: column;
            gap: 5px;
            margin-bottom: 20px;
        }

        .field {
            margin-bottom: 1rem;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }

        .valid-message {
            margin-top: 12px;
            background-color: var(--md-sys-color-surface);
            padding: 12px;
            border: 1px solid var(--md-sys-color-outline);
            border-radius: var(--md-sys-shape-corner-small);
        }

        .check-btn-ctr {
            text-align: right;
        }
        
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-add-page-dialog': AddPageDialog
  }
}
