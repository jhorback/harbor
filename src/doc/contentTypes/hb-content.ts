import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContentActiveChangeEvent, DocEditModeChangeEvent, HbDocPage } from "../docTypes/pages/hb-doc-page";
import { styles } from "../../styles";
import { MoveDocContentEvent } from "../data/hb-doc-data";

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

    get $docHost() { return (this.$contentHost.getRootNode() as ShadowRoot).host; }

    get $contentHost() { return (this.getRootNode() as ShadowRoot).host }

    private editModeHandler:((event:Event) => void)|null = null;

    connectedCallback() {
        super.connectedCallback();
        this.editModeHandler = this.editModeChange.bind(this);
        this.$docHostRef = this.$docHost;
        this.$docHostRef.addEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
        this.docEdit = (this.$docHost as HbDocPage).inEditMode;
    }

    private $docHostRef:Element|null = null;

    disconnectedCallback() {
        super.disconnectedCallback();
        this.editModeHandler && this.$docHostRef &&
            this.$docHostRef.removeEventListener(DocEditModeChangeEvent.eventType, this.editModeHandler);
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
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Done editing"
                                @click=${this.done}>
                                check
                            </span>
                        ` : html`
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Move down"
                                @click=${this.moveDownClicked}>
                                arrow_downward
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Move up"
                                @click=${this.moveUpClicked}>
                                arrow_upward
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Edit"
                                @click=${this.edit}>
                                edit
                            </span>
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

    private moveUpClicked() {
        const index = (this.$contentHost as IIndexable).contentIndex;
        index !== undefined ? this.dispatchEvent(new MoveDocContentEvent(index, true)) :
            console.error("Cannot move up, content has no content index");
    }

    private moveDownClicked() {
        const index = (this.$contentHost as IIndexable).contentIndex;
        index !== undefined ? this.dispatchEvent(new MoveDocContentEvent(index, false)) :
            console.error("Cannot move down, content has no content index");
    }

    edit() {
        this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        this.contentEdit = true;
    }

    done(event:Event) {
        this.dispatchEvent(new ContentActiveChangeEvent(this, false));
        event.stopImmediatePropagation();
    }

    static styles = [styles.icons, css`
        :host {
            display: block;
            position: relative;       
        }
        .edit-toolbar {
            display: none;
            gap: 10px;
            position: absolute;
            top:0;
            right: 0;
            z-index: 10000;
            // background-color: var(--md-sys-color-surface-variant);
            // border-radius: var(--md-sys-shape-corner-medium);
            padding: 4px;
        }
        :host([doc-edit]:hover),
        :host([doc-edit][is-active]),
        :host([content-edit]) {            
            //background-color: var(--md-sys-color-surface-variant);
            border-radius: var(--md-sys-shape-corner-medium);
            outline: 1px solid var(--md-sys-color-outline);
            margin: -1rem;
            padding: 1rem;
        }
        // :host([content-edit]) {
        //     outline: 0px solid transparent !important;
        // }
        :host([doc-edit]:hover) .edit-toolbar,
        :host([doc-edit][is-active]) .edit-toolbar,
        :host([content-edit]) .edit-toolbar {
            display: flex;
            justify-content: end;
        }        
  `];
}

interface IIndexable {
    contentIndex?:number
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
