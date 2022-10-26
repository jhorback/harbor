import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "../../../styles";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { TextContentData } from "../textContentType";
import { HbApp } from "../../../domain/HbApp";
import { FileUploaderAccept, FileUploaderClient } from "../../../files/FileUploaderClient";
import { FileUploadCompletedEvent } from "../../../domain/interfaces/FileInterfaces";
import "../hb-content";
import { HbContent } from "../hb-content";
import { ContentActiveChangeEvent } from "../../docTypes/pages/hb-doc-page";

/**
 */
@customElement('hb-text-content')
export class TextContent extends LitElement {
    static defaultState = new TextContentData();

    @property({type:Number, attribute: "content-index"})
    contentIndex:number = -1;

    @property({type: Object})
    state:TextContentData = TextContent.defaultState;

    @query("hb-content")
    $hbContent!:HbContent;

    render() {
        return html`
            <hb-content @content-active-change=${this.contentActive} ?is-empty=${!this.state.text}>
                <div>${unsafeHTML(this.state.text)}</div>
                <div slot="doc-edit-empty" @click=${this.textClicked}>
                    Click to enter text content
                </div>
                <div slot="content-edit">
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
                </div>
            </hb-content>
        `;
    }

    contentActive(event:ContentActiveChangeEvent) {
        if (event.active) {
            // @ts-ignore
            import("@tinymce/tinymce-webcomponent");
        }
    }

    textClicked() {
        this.$hbContent.edit();
    }

    tinymceChange(event:ChangeEvent) {
        this.dispatchEvent(new UpdateDocContentEvent(this.contentIndex, TextContentData.of(event.value)));
    }

    static styles = [styles.types, styles.format, css`
        :host {
            display: block;
        }
  `]
}


if (!window.tinymceSettings) {
    window.tinymceSettings = {
        config: {
            branding: false,
            statusbar: false,
            content_css: "/theme/harbor/tinymce/content.css",
            skin_url: "/theme/harbor/tinymce",
            body_class: `material-theme ${HbApp.theme}-theme`,
            content_style: "body { margin-top: 1rem; margin-left: 4px; }",
            toolbar_sticky: true,
            text_patterns: true,
            automatic_uploads: true,
            image_title: true,
            file_picker_types: "image media",
            file_picker_callback: (callback:FileUploadCallback, value:string, meta:IFilePickerMetaFields) => {
                const accept = meta.filetype === "image" ? FileUploaderAccept.images : FileUploaderAccept.media;
                const client = new FileUploaderClient({accept:accept});
                client.onComplete((event:FileUploadCompletedEvent) => 
                    event.uploadedFile && callback(event.uploadedFile.url, {title:event.uploadedFile.name}));
                client.handleFileUpload();
            },
            plugins: "autolink lists link image autoresize fullscreen media table tinymcespellchecker codesample",
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
            event.target.targetElm.dispatchEvent(new ChangeEvent(event.target.getContent()))
        }  
    } 
}

type FileUploadCallback = (fileName:string, meta:{ title: string }) => void;


interface IFilePickerMetaFields {
    filetype: string;
}

interface ITinyMceChangeEvent {
    target: {
        targetElm: HTMLElement,
        getContent: Function
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
