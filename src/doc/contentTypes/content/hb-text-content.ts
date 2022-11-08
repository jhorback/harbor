import { html, css, LitElement, render } from "lit";
import { customElement, property, query, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "../../../styles";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { TextContentData } from "../textContentType";
import { HbApp } from "../../../domain/HbApp";
import "../hb-content";
import { HbContent } from "../hb-content";
import { ContentActiveChangeEvent } from "../../docTypes/pages/hb-doc-page";
import { FileUploaderAccept, FileUploadPanel, FileUploadCompleteEvent } from "../../../files/hb-file-upload-panel";
import { FileType } from "../../../domain/interfaces/FileInterfaces";

/**
 */
@customElement('hb-text-content')
export class TextContent extends LitElement {
    static defaultState = new TextContentData();

    @property({type:Number})
    contentIndex:number = -1;

    @property({type: Object})
    data:TextContentData = TextContent.defaultState;

    @query("hb-content")
    $hbContent!:HbContent;

    render() {
        return html`
            <hb-content @content-active-change=${this.contentActive} ?is-empty=${!this.data.text}>
                <div class="clearfix">${unsafeHTML(this.data.text)}</div>
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
                        bullist numlist indent hr | harborSearch harborUpload | link image media table | codesample  fullscreen"
                >${this.data.text}</tinymce-editor>
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
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
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
            // file_picker_types: "image media",
            // file_picker_callback: (callback:FileUploadCallback, value:string, meta:IFilePickerMetaFields) => {                
            //     FileUploadPanel.openFileSelector({
            //         accept: meta.filetype === "image" ? FileUploaderAccept.images : FileUploaderAccept.media,
            //         onUploadComplete: (event:FileUploadCompleteEvent) => {
            //             event.uploadedFile && callback(event.uploadedFile.url, {title:event.uploadedFile.name});
            //         }
            //     })
            // },
            setup: (editor:any) => {

                editor.ui.registry.addButton("harborSearch", {
                    icon: "search",
                    tooltip: 'Search for page, images, audio, or video',
                    onAction: (api:any) => {
                        alert("search");
                        /**
                         * * -> search - need text-content-selector-dialog
                         *    create static method like upload content
                         *    option for type: link, media
                         *    if not set, the dialog should provide an option
                         *    then show either the find doc or find file dialog
                         * 
                         * if content selection is <a> or <video> can use this to
                         * seed the selector dialog which would not show the link / media selection
                         */
                    }
                });
                
                editor.ui.registry.addButton("harborUpload", {
                    icon: "upload",
                    tooltip: 'Upload images, audio, or video',
                    onAction: (api:any) => {
                        
                        // EXAMPLES;
                        // const selection = editor.selection.getContent(); // this is the selection that will be replaced
                        // editor.insertContent("woo hoo");
                        // editor.insertContent('<a href="https://www.google.com">GOOGLE</a>');
                        // editor.selection.getNode().tagName === "A" === "IMG"
                       
                        const selectedNode = editor.selection.getNode();

                        const selectedTag = selectedNode.tagName;
                        const accept = selectedTag === "IMG" ? FileUploaderAccept.images :
                            selectedTag === "VIDEO" ? FileUploaderAccept.media :
                            FileUploaderAccept.all; 

                        FileUploadPanel.openFileSelector({
                            accept,
                            onUploadComplete: (event:FileUploadCompleteEvent) => {
                                if (!event.uploadedFile) {
                                    return;
                                }

                                const upload = event.uploadedFile;
                                const fileType = upload.type?.indexOf("image") === 0 ? FileType.image :
                                    upload.type?.indexOf("audio") === 0 ? FileType.audio :
                                    upload.type?.indexOf("video") === 0 ? FileType.video : FileType.files;

                                let content = "";
                                if (fileType === FileType.image) {
                                    content = `<img src="${upload.url}" title="${upload.name}" alt="${upload.name}">`;
                                } else if(fileType === FileType.audio || fileType === FileType.video) {
                                    content = `
<video controls poster="${upload.pictureUrl || ""}" width="${upload.width || (fileType === FileType.audio ? 300 : "")}" height="${upload.height || (fileType === FileType.audio ? 50 : "")}">
    <source src="${upload.url}" type="${upload.type}">
</video>
`;                              
                                } else {
                                    content = `<a href="${upload.url}" target="_blank" title="${upload.name}">${upload.name}</a>`;
                                }
                                editor.selection.select(selectedNode);
                                editor.insertContent(content);
                            }
                        });                       
                    }
                });
                
            },
            
            plugins: "autolink lists link image autoresize fullscreen media table codesample",
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
