import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import { ContentActiveChangeEvent, ContentEmptyEvent, HbPage, PageEditModeChangeEvent } from "./hb-page";
import { MovePageContentEvent } from "./PageController";

/**
 */
@customElement('hb-page-content')
export class HbPageContent extends LitElement {

    @property({type: Boolean, attribute: "is-empty"})
    isEmpty = false;

    @property({type: Boolean, attribute: "page-edit", reflect: true})
    pageEdit = false;

    @property({type: Boolean, attribute: "content-edit", reflect: true})
    contentEdit = false;

    @property({type: Boolean, attribute: "is-active", reflect: true})
    isActive = false;

    abortController = new AbortController();

    get $pageHost() { return (this.$contentHost.getRootNode() as ShadowRoot).host as HbPage; }

    get $contentHost() { return (this.getRootNode() as ShadowRoot).host }

    connectedCallback() {
        super.connectedCallback();
        this.$pageHost.addEventListener(PageEditModeChangeEvent.eventType, this.editModeChange,
            { signal: this.abortController.signal } as AddEventListenerOptions);
        this.pageEdit = (this.$pageHost as HbPage).inEditMode;
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.abortController.abort();
        this.abortController = new AbortController();
    }

    editModeChange(event:Event) {
        this.pageEdit = (event as PageEditModeChangeEvent).inEditMode;
    }

    render() {
        return html`
            <div class="hb-content" @click=${this.contentClicked}>
                ${this.pageEdit ? html`
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
                                title="Delete content"
                                @click=${this.delete}>
                                delete
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Edit content"
                                @click=${this.edit}>
                                edit
                            </span>
                        `}                    
                    </div>                
                ` : html``}
                ${!this.contentEdit && this.pageEdit && this.isEmpty ? html`
                    <slot name="page-edit-empty"></slot>
                ` : this.contentEdit ? html`
                    <slot name="content-edit"></slot>
                    <div class="content-edit-tools">
                        <slot name="content-edit-tools"></slot>
                    </div>
                `: html`
                    <slot></slot>
                `}
            </div>
        `;
    }

    updated() {
        const index = (this.$contentHost as IIndexable).contentIndex;
        this.dispatchEvent(new ContentEmptyEvent(this.$contentHost, this.isEmpty));
    }

    private contentClicked(event:Event) {
        if(this.pageEdit && !this.isActive) {
            this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        }
    }

    private moveUpClicked() {
        const index = (this.$contentHost as IIndexable).contentIndex;
        index !== undefined ? this.dispatchEvent(new MovePageContentEvent(index, true)) :
            console.error("Cannot move up, content has no content index");
    }

    private moveDownClicked() {
        const index = (this.$contentHost as IIndexable).contentIndex;
        index !== undefined ? this.dispatchEvent(new MovePageContentEvent(index, false)) :
            console.error("Cannot move down, content has no content index");
    }

    edit() {
        this.dispatchEvent(new ContentActiveChangeEvent(this, true));
        this.contentEdit = true;
    }

    delete() {
        if (!confirm("Are you sure you want to delete this content?")) {
            return;
        }
        alert("delete");
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
            z-index: 19;
            padding: 4px;
            border: 1px solid var(--md-sys-color-outline);
            border-radius: 0 12px;
            border-width: 0 0 1px 1px;
            background-color: var(--md-sys-color-surface-variant)
        }
        :host([doc-edit]:hover),
        :host([doc-edit][is-active]),
        :host([content-edit]) {
            border-radius: var(--md-sys-shape-corner-medium);
            outline: 1px solid var(--md-sys-color-outline);
            margin: -1rem;
            padding: 1rem;
        }
        :host([doc-edit]:hover) .edit-toolbar,
        :host([doc-edit][is-active]) .edit-toolbar,
        :host([content-edit]) .edit-toolbar {
            display: flex;
            justify-content: end;
        }
        .content-edit-tools {
            background: var(--md-sys-color-surface-variant);
            border-radius: 0 0 12px 12px;
            // outline: 1px solid var(--md-sys-color-outline);        
            margin: -1rem;
            margin-top: 8px;
        }
  `];
}

interface IIndexable {
    contentIndex?:number
}

declare global {
    interface HTMLElementTagNameMap {
        'hb-page-content': HbPageContent
    }
}
