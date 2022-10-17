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
    inDocEditMode:Boolean = true;

    @property({type: Object})
    state:TextContentData = TextContent.defaultState;

    @state()
    inEditMode = true;

    /**
     * style formats:
     * https://www.tiny.cloud/docs/configure/content-formatting/#formats
     * custom button:
     * https://www.tiny.cloud/docs/demo/custom-toolbar-button/#
     * custom menu button:
     * https://www.tiny.cloud/docs/demo/custom-toolbar-menu-button/
     */
    render() {
        return this.inEditMode ? html`
            <tinymce-editor
                config="tinymceSettings.config"
                on-Change="tinymceSettings.changeHandler"
                @change=${this.tinymceChange}
                api-key="g3l947xa1kp0eguyzlt3vwy92xiobi1mowojbtjllsw91xyt"
                height="500"
                menubar="false"
                toolbar="undo redo | styles | bold italic underline strikethrough | align |
                bullist numlist indent hr | link image media table | codesample  fullscreen"
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
            position: relative;
        }
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
        :host([doc-edit]:hover) {
            background-color: var(--md-sys-color-surface-variant);
        }
  `]
}


if (!window.tinymceSettings) {
    window.tinymceSettings = {
        config: {
            branding: false,
            statusbar: false,
            content_css: "/tinymce/skins/content/harbor/content.css",
            skin_url: "/tinymce/skins/ui/harbor",
            plugins: "autolink lists link image autoresize fullscreen media table " +
                "tinymcespellchecker codesample hr tabfocus textpattern",
            tabfocus_elements: ':prev,:next',
            style_formats_merge: false,
            style_formats: [               
                  { title: 'Heading 1', block: 'h2', attributes: { class: 'headline-medium' } },
                  { title: 'Heading 2', block: 'h3', attributes: { class: 'headline-small' }},
                  { title: 'Heading 3', block: 'h4', attributes: { class: 'title-large' } },
                  { title: "Quote", format: "blockquote" },
                  { title: "Paragraph", format: "p" },                
              ]
        },
        changeHandler: (event:ITinyMceChangeEvent) => {
            event.target.targetElm.dispatchEvent(new ChangeEvent(event.level.content))
        }  
    } 
}


interface ITinyMceChangeEvent {
    target: {
        targetElm: HTMLElement
    }
    level: {
        content: string
    }
};

interface ITinyMceSettings {
    changeHandler: any,
    config: any
}


class ChangeEvent extends Event {
    static eventType = "change";
    value:string;
    constructor(value:string) {
        super(ChangeEvent.eventType, {bubbles:true, composed: true});
        this.value = value;
    }
}


declare global {
    interface Window { tinymceSettings: ITinyMceSettings; }
    interface HTMLElementTagNameMap {
        'hb-text-content': TextContent
    }
}
