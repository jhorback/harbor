import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "../../../styles";
import { TextContentData } from "../textContentType";
import "@tinymce/tinymce-webcomponent";

/**
 */
@customElement('hb-text-content')
export class TextContent extends LitElement {
    static defaultState = new TextContentData();

    @property({type:Number})
    index:Number = -1;

    @property({type:Boolean, attribute: "edit-mode"})
    inEditMode:Boolean = false;

    @property({type: Object})
    state:TextContentData = TextContent.defaultState;

    @query("tinymce-editor")
    $editor!:HTMLDivElement;

    render() {
        this.state.text = "<b>this is bold text</b>";
        return html`
            Text Content ${this.index} : ${this.inEditMode}
            ${unsafeHTML(this.state.text)}
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
                >
                ${this.state.text}
                </tinymce-editor>
        `;
    }

    tinymceChange(event:ChangeEvent) {
        console.log(event.value);
    }

    static styles = [styles.types, styles.dialog, css`
        :host {
            display: block;
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
