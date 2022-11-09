import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { HbApp } from "../../../domain/HbApp";
import { FileType, IUploadedFile } from "../../../domain/interfaces/FileInterfaces";
import { FileUploadCompleteEvent, FileUploaderAccept, FileUploadPanel } from "../../../files/hb-file-upload-panel";
import { FileSelectedEvent } from "../../../files/hb-find-file-dialog";
import { styles } from "../../../styles";
import { DocThumbEvent, UpdateDocContentEvent } from "../../data/hb-doc-data";
import { ContentActiveChangeEvent } from "../../docTypes/pages/hb-doc-page";
import { DocumentSelectedEvent } from "../../hb-find-doc-dialog";
import "../hb-content";
import { HbContent } from "../hb-content";
import { TextContentData } from "../textContentType";
import { TextContentSelectorDialog, TextContentSelectorType } from "./hb-text-content-selector-dialog";

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
            image_title: true,
            convert_urls: false,
            setup: (editor:any) => {

                editor.ui.registry.addButton("harborSearch", {
                    icon: "search",
                    tooltip: 'Search for page, images, audio, or video',
                    onAction: onHarborSearch(editor)
                });
                
                editor.ui.registry.addButton("harborUpload", {
                    icon: "upload",
                    tooltip: 'Upload images, audio, or video',
                    onAction: onHarborUpload(editor)
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


const onHarborSearch = (editor:any) => () => {
    const selectedNode = editor.selection.getNode();
    const type = selectedNode.dataset.mcePDataType || selectedNode.dataset.type || null;
    const selType = type === "image" ? TextContentSelectorType.image :
        type === "audio" ? TextContentSelectorType.audio :
        type === "video" ? TextContentSelectorType.video :
        type === "file" ? TextContentSelectorType.file :
        type === "page" ? TextContentSelectorType.page :
        TextContentSelectorType.any;                     
    
    TextContentSelectorDialog.openContentSelector({
        type: selType,
        onDocumentSelected: (event:DocumentSelectedEvent) => {
            const thumb = event.docModel.toDocumentThumbnail();
            const content = `<a href="${thumb.href}" title="${thumb.title}" data-type="page">${thumb.title}</a>`;
            editor.selection.select(selectedNode);
            editor.insertContent(content);
        },
        onFileSelected: (event:FileSelectedEvent) => {
            insertFile(selectedNode, editor, {...event.file, fileDbPath:""});
        }
    });
};

const onHarborUpload = (editor:any) => () => {
    const selectedNode = editor.selection.getNode();
    const selectedTag = selectedNode.tagName;
    const accept = selectedTag === "IMG" ? FileUploaderAccept.images :
        (selectedTag === "VIDEO" || selectedNode.querySelector("video") !== null) ?
            FileUploaderAccept.media : FileUploaderAccept.all; 

    FileUploadPanel.openFileSelector({
        accept,
        onUploadComplete: (event:FileUploadCompleteEvent) => {
            event.uploadedFile && insertFile(selectedNode, editor, event.uploadedFile);
        }
    });
};

const insertFile = (selectedNode:any, editor:any, file:IUploadedFile) => {
    const fileType = file.type?.indexOf("image") === 0 ? FileType.image :
    file.type?.indexOf("audio") === 0 ? FileType.audio :
    file.type?.indexOf("video") === 0 ? FileType.video : FileType.file;

    // tell the document we may have some thumbs
    const thumbs:Array<string> = [];
    file.thumbUrl && thumbs.push(file.thumbUrl);
    file.pictureUrl && thumbs.push(file.pictureUrl);
    thumbs.length > 0 && editor.getContainer().dispatchEvent(new DocThumbEvent(thumbs));


    let content = "";
    if (fileType === FileType.image) {
        content = `<img src="${file.url}" title="${file.name}" alt="${file.name}" data-type="image">`;
    } else if(fileType === FileType.audio || fileType === FileType.video) {
        content = `<video controls poster="${file.pictureUrl || ""}"
            width="${file.width || (fileType === FileType.audio ? 300 : "")}"
            height="${file.height || (fileType === FileType.audio ? 50 : "")}"
            data-type="${fileType}">
                <source src="${file.url}" type="${file.type}">
            </video>
            `;                              
    } else {
        content = `<a href="${file.url}" target="_blank" title="${file.name}" data-type="file">${file.name}</a>`;
    }
    editor.selection.select(selectedNode);
    editor.insertContent(content);
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
