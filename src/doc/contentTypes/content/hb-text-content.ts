import { html, css, LitElement } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "../../../styles";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { TextContentData } from "../textContentType";
import { HbApp } from "../../../domain/HbApp";
import { HbUploadFilesRepo } from "../../../domain/Files/HbUploadFilesRepo";
import { ClientError } from "../../../domain/Errors";

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
                ${this.inDocEditMode && this.state.text === "" ? html`
                    Click to enter text content
                    ` :
                    unsafeHTML(this.state.text)}
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

    static styles = [styles.types, styles.format, css`
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
        // :host([doc-edit]:hover) {
        //     background-color: var(--md-sys-color-surface-variant);
        // }
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
            link_context_toolbar: false,
            automatic_uploads: true,
            image_title: true,
            file_picker_types: "image media",
            file_picker_callback: function (cb, value, meta) {
                const fileRepo = new HbUploadFilesRepo();
                var input = document.createElement('input');
                input.setAttribute('type', 'file');
                const accept = meta.filetype === "media" ? "." + [
                    ...fileRepo.supportedFileTypes.audio,
                    ...fileRepo.supportedFileTypes.video
                    ].join(", .") : "." + fileRepo.supportedFileTypes.images.join(", .");
                input.setAttribute("accept", accept);

                
                input.onchange = async function (event:Event) {
                    const thisInputEl = event.target as HTMLInputElement;
                    var file = thisInputEl.files![0];
                    

                    try {
                        const fileName = await fileRepo.uploadFile(file, {
                            allowOverwrite: false
                        });
    
                        cb(fileName, { title: file.name });
                    } catch (error:any) {
                        if (error instanceof ClientError && error.properties["reason"] === "exists") {
                            const ans = confirm("The file already exists.\n\nWould you like to overwrite it?");
                            if (ans) {
                                const fileName = await fileRepo.uploadFile(file, {
                                    allowOverwrite: true
                                });
            
                                cb(fileName, { title: file.name });
                            }
                        } else {
                            throw error;
                        }
                    }
                };
            
                input.click();
              },
            plugins: "autolink lists link image autoresize fullscreen media table " +
                "tinymcespellchecker codesample",
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

/*
Clean up this file
Use an injected interface for File repo
Research progress on uploads (consider creating a ticket)
    Ticket can be both a dialog for overwrite confirmation
    And a dialog for showing upload progress
*/

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
