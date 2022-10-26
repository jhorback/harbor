import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { ContentActiveChangeEvent, DocEditModeChangeEvent } from "../docTypes/pages/hb-doc-page";



/**
 */
@customElement('hb-content')
export class HbContent extends LitElement {

    @property({type: Boolean, attribute: "is-empty"})
    isEmpty = false;

    @property({type: Boolean, attribute: "doc-edit", reflect: true})
    docEdit = false;

    @property({type: Boolean, attribute: "content-edit", reflect: true})
    contentEdit = false;

    @property({type: Boolean, attribute: "is-active", reflect: true})
    isActive = false;

    get $host() { return ((this.getRootNode() as ShadowRoot).host.getRootNode() as ShadowRoot).host; };

    private editModeHandler:((event:Event) => void)|null = null;

    connectedCallback() {
        super.connectedCallback();
        this.editModeHandler = this.editModeChange.bind(this);
        this.$host.addEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.editModeHandler &&
            this.$host.removeEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
    }

    editModeChange(event:Event) {
        this.docEdit = (event as DocEditModeChangeEvent).inEditMode;
    }

    render() {
        return html`
            <div class="hb-content" @click=${this.contentClicked}>
                ${this.docEdit ? html`
                    <div class="edit-toolbar">
                        ${this.contentEdit ? html`
                            <slot name="edit-toolbar"></slot>
                            <button @click=${this.done}>Done</button>
                        ` : html`
                            <button>Move Down</button>
                            <button>Move Up</button>
                            <button @click=${this.edit}>Edit</button>
                        `}                    
                    </div>                
                ` : html``}
                ${!this.contentEdit && this.docEdit && this.isEmpty ? html`
                    <slot name="doc-edit-empty"></slot>
                ` : this.contentEdit ? html`
                    <slot name="content-edit"></slot>
                `: html`
                    <slot></slot>
                `}
            </div>
        `;
    }

    private contentClicked(event:Event) {
        if(this.docEdit && !this.isActive) {
            this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        }
    }

    edit() {
        this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        this.contentEdit = true;
    }

    done(event:Event) {
        this.dispatchEvent(new ContentActiveChangeEvent(this, false));
        event.stopImmediatePropagation();
    }

    static styles = [css`
        :host {
            display: block;                      
        }
        .edit-toolbar {
            display: none;
        }
        :host([doc-edit]:hover),
        :host([doc-edit][is-active]),
        :host([content-edit]) {
            border: 1px dotted red;
        }
        :host([doc-edit]:hover) .edit-toolbar,
        :host([doc-edit][is-active]) .edit-toolbar,
        :host([content-edit]) .edit-toolbar {
            display: flex;
        }        
  `];
}

/*
// :host::before {
        //     content: "";
        //     background-color: var(--md-sys-color-surface-variant);
        //     width: 100%;
        //     height:100%;
        //     border-radius: var(--md-sys-shape-corner-medium);
        //     display: block;
        //     position: absolute;
        //     left:-20px;
        //     top:-20px;
        //     right: -20px;
        //     bottom: -20px;
        //     z-index: -1;
        // }
        // :host([doc-edit]:hover) {
        //     background-color: var(--md-sys-color-surface-variant);
        // }
    */

declare global {
    interface HTMLElementTagNameMap {
        'hb-content': HbContent
    }
}
