import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../../styles";
import { ContentActiveChangeEvent, ContentDeletedEvent } from "./PageController";
import { MovePageContentEvent } from "./PageController";
import { PageContentController } from "./PageContentController";

/**
 */
@customElement('hb-page-content')
export class HbPageContent extends LitElement {

    get stateId() { return this.pathname; }

    pageContent:PageContentController<any> = new PageContentController(this);

    @property({type: String})
    pathname:string = "";

    @property({type: Number, attribute:"content-index"})
    contentIndex:number = -1;

    @property({type: Boolean, attribute: "is-empty"})
    isEmpty = false;

    render() {
        const content = this.pageContent.page.state.page.content[this.contentIndex];
        const pageState = this.pageContent.page.state;
        const contentState = this.pageContent.contentState;
        return html`
            <div class="hb-content"
                ?page-edit=${pageState.inEditMode}
                ?content-edit=${contentState.inContentEditMode}
                ?other-active=${contentState.otherActive}
                @click=${this.contentClicked}>
                ${pageState.inEditMode ? html`
                    <div class="edit-toolbar" @click=${this.editToolbarClicked}>
                        ${contentState.inContentEditMode ? html`
                            <span class="content-label-edit">
                                <input type="text" class="title-large" placeholder=${contentState.contentTypeName} value=${content.label}>
                            </span>
                            <slot name="edit-toolbar"></slot>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Done editing"
                                @click=${this.done}>
                                check
                            </span>
                        ` : html`                           
                            <span class="content-label-edit title-large">${content.label || contentState.contentTypeName}</span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Move down"
                                ?disabled=${!contentState.canMoveDown}
                                @click=${this.moveDownClicked}>
                                arrow_downward
                            </span>
                            <span
                                class="icon-button icon-small"
                                tab-index="0"
                                title="Move up"
                                ?disabled=${!contentState.canMoveUp}
                                @click=${this.moveUpClicked}>
                                arrow_upward
                            </span>
                            <span
                                ?hidden=${content?.canDelete === false}
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
                <div class="content-content">
                ${!contentState.inContentEditMode && pageState.inEditMode && this.isEmpty ? html`
                    <slot name="page-edit-empty"></slot>
                ` : contentState.inContentEditMode ? html`
                    <slot name="content-edit"></slot>
                    <div class="content-edit-tools">
                        <slot name="content-edit-tools"></slot>
                    </div>
                `: html`
                    ${pageState.inEditMode && content.label ? html`
                        <div class="content-label title-large">${content.label}</div>
                    ` : html``}                    
                    <slot></slot>
                `}
                </div>
            </div>
        `;
    }

    private contentClicked() {
        //if(this.pageContent.page.state.inEditMode && !this.pageContent.contentState.isActive) {
            this.dispatchEvent(new ContentActiveChangeEvent({
                contentIndex: this.contentIndex,
                isActive: true,
                inEditMode: false
            }));
        //}
    }

    private moveUpClicked() {
        const contentState = this.pageContent.contentState;
        contentState.canMoveUp &&
            this.dispatchEvent(new MovePageContentEvent(this.contentIndex, true));
    }

    private moveDownClicked() {
        const contentState = this.pageContent.contentState;
        contentState.canMoveDown &&
            this.dispatchEvent(new MovePageContentEvent(this.contentIndex, false));
    }

    editToolbarClicked(event:Event) {
        event.stopPropagation();
    }

    edit() {
        this.dispatchEvent(new ContentActiveChangeEvent({
            contentIndex: this.contentIndex,
            isActive: true,
            inEditMode: true
        }));
    }

    delete() {
        confirm("Are you sure you want to delete this content?") &&
            this.dispatchEvent(new ContentDeletedEvent(this.contentIndex));
    }

    done() {
        this.dispatchEvent(new ContentActiveChangeEvent({
            contentIndex: this.contentIndex,
            inEditMode: false,
            isActive: false
        }));
    }

    static styles = [styles.icons, styles.types, css`
        :host {
            display: block;       
        }
        [hidden] {
            display: none;
        }
        .hb-content {
            display: block;
        }
        .edit-toolbar {
            display: none;
        }

        /* set the background color in case this scrolls over another */
        .hb-content[page-edit],
        .hb-content[content-edit] {
            background-color: var(--md-sys-color-background);
        }

        .hb-content[page-edit] .edit-toolbar,
        .hb-content[content-edit] .edit-toolbar {
            display: flex;
            gap: 10px;
            padding: 4px;
            border: 1px solid var(--md-sys-color-outline);
            border-width: 0 0 1px 0;
            margin: 8px 0px;
        }

        /* fade the element when another is active */
        .hb-content[page-edit][other-active] .content-content,
        .hb-content[page-edit][other-active] .edit-toolbar {
            opacity: 0.2;
        }
        .hb-content[page-edit][other-active] .edit-toolbar:hover {
            opacity: 1;
        }


        .content-label-edit {
            margin: auto;
            flex-grow: 1;
        }
        .content-label-edit input {
            border: 0;
            background-color: transparent;
            position: relative;
            left: -2px;
            width: 100%;
        }
        .content-label-edit input:focus {
            outline: 0px;
        }
        .content-label {
            margin: 8px 0;
        }


        .content-edit-tools {
            background: var(--md-sys-color-surface);
            border-radius: var(--md-sys-shape-corner-medium);
            margin-top: 8px;
        }
        span[disabled] {
            opacity: 0.12;
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
