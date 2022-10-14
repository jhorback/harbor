import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "../../../styles";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { TextContentData } from "../textContentType";

/**
 */
@customElement('hb-text-content')
export class TextContent extends LitElement {
    static defaultState = new TextContentData();

    @property({type:String})

    @property({type:Number})
    index:number = -1;

    @property({type:Boolean, attribute: "doc-edit"})
    inDocEditMode:Boolean = false;

    @property({type: Object})
    state:TextContentData = TextContent.defaultState;

    @state()
    inEditMode = false;

    render() {
        return this.inEditMode ? html`
            <tinymce-editor
                @change=${this.tinymceChange}
                api-key="g3l947xa1kp0eguyzlt3vwy92xiobi1mowojbtjllsw91xyt"
                height="500"
                menubar="false"
                plugins="advlist autolink lists link image charmap preview anchor
                searchreplace visualblocks code fullscreen
                insertdatetime media table code help wordcount"
                toolbar="undo redo | formatselect | bold italic backcolor |
                alignleft aligncenter alignright alignjustify |
                bullist numlist outdent indent | removeformat | help"
                skin="borderless"
                content_css="dark"
                setup="setupEditor"
                on-Change="tinymceChangeHandler"
            >${this.state.text}</tinymce-editor>
        ` : html`
            <div @click=${this.textClicked}>
                ${unsafeHTML(this.state.text)}
            </div>
        `;
    }

    updated() {
        if (!this.inDocEditMode) {
            this.inEditMode = false;
        }

        if (this.inEditMode) {
            // @ts-ignore
            import("@tinymce/tinymce-webcomponent");
        }
    }

    textClicked() {
        if (this.inDocEditMode) {
            this.inEditMode = true;
        }
    }

    tinymceChange(event:ChangeEvent) {
        this.dispatchEvent(new UpdateDocContentEvent(this.index, TextContentData.of(event.value)));
    }

    static styles = [styles.types, styles.dialog, css`
        :host {
            display: block;
        }
        :host([doc-edit]:hover) {
            background-color: var(--md-sys-color-surface-variant);
        }
  `]
}


if (!window.tinymceChangeHandler) {
    window.tinymceChangeHandler = (event:ITinyMceChangeEvent) => {
        event.target.targetElm.dispatchEvent(new ChangeEvent(event.level.content))
    };
}


interface ITinyMceChangeEvent {
    target: {
        targetElm: HTMLElement
    }
    level: {
        content: string
    }
};


class ChangeEvent extends Event {
    static eventType = "change";
    value:string;
    constructor(value:string) {
        super(ChangeEvent.eventType, {bubbles:true, composed: true});
        this.value = value;
    }
}


declare global {
    interface Window { tinymceChangeHandler: any; }
    interface HTMLElementTagNameMap {
        'hb-text-content': TextContent
    }
}
