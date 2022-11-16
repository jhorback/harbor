import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { HbApp } from "../../../domain/HbApp";
import { FileType, IUploadedFile } from "../../../domain/interfaces/FileInterfaces";
import { FileUploadCompleteEvent, FileUploaderAccept, FileUploadPanel } from "../../../files/hb-file-upload-panel";
import { FileSelectedEvent } from "../../../files/hb-find-file-dialog";
import { styles } from "../../../styles";
import { ContentActiveChangeEvent, PageThumbChangeEvent, UpdatePageContentEvent } from "../../hb-page";
import { PageSelectedEvent } from "../../hb-find-page-dialog";
import { HbPageContent } from "../../hb-page";
import { TextContentData } from "./textContentType";
import { TextContentSelectorDialog, TextContentSelectorType } from "./hb-text-content-selector-dialog";
import { PageContentController } from "../../hb-page/PageContentController";

/**
 */
@customElement('hb-text-content')
export class TextContent extends LitElement {

    get stateId() { return this.pathname; }

    pageContent:PageContentController<TextContentData> = new PageContentController(this);

    @property({type: String})
    pathname:string = "";

    @property({type:Number, attribute: "content-index"})
    contentIndex:number = -1;

    @query("hb-page-content")
    $hbPageContent!:HbPageContent;

    @query("[slot=content-edit]")
    $contentEditSlot!:HTMLDivElement;

    render() {
        const content = this.pageContent.content || new TextContentData(); // jch use default?
        return html`
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${!content.text}
                @content-active-change=${this.contentActive}>

                <div class="clearfix">${unsafeHTML(content.text)}</div>
                <div slot="page-edit-empty" @click=${this.textClicked}>
                    Click to enter text content
                </div>
                <div slot="content-edit">
                   <!-- tinymce here -->
                </div>
            </hb-page-content>
        `;
    }

    contentActive(event:ContentActiveChangeEvent) {
        if (event.options.isActive) {
            // @ts-ignore
            import("@tinymce/tinymce-webcomponent");

            // need to programmatically create the tinymce element to account for moving content
            // when it is in the dom, the content.text is held on to 
            const container = this.shadowRoot?.querySelector("[slot=content-edit]") as HTMLDivElement;
            this.$contentEditSlot.innerHTML = "";
            const tiny = document.createElement("tinymce-editor");
            tiny.setAttribute("config", "tinymceSettings.config");
            tiny.setAttribute("on-change", "tinymceSettings.changeHandler");
            tiny.setAttribute("api-key", "g3l947xa1kp0eguyzlt3vwy92xiobi1mowojbtjllsw91xyt");
            tiny.setAttribute("height", "500");
            tiny.setAttribute("menubar", "false");
            tiny.setAttribute("toolbar", [
                "undo redo",
                "styles",
                "bold italic underline strikethrough",
                "align",
                "bullist numlist indent hr",
                "harborSearch harborUpload",
                "link image media table",
                "codesample  fullscreen"
            ].join(" | "));
            tiny.innerText = this.pageContent.content.text;
            tiny.addEventListener("change", (event:Event) => this.tinymceChange(event as TinymceChangeEvent));
            this.$contentEditSlot.appendChild(tiny);
        }
    }

    textClicked() {
        this.$hbPageContent.edit();
    }

    tinymceChange(event:TinymceChangeEvent) {        
        this.checkForThumbs(event.value);
        this.dispatchEvent(new UpdatePageContentEvent(this.contentIndex, TextContentData.of(event.value)));
    }

    private checkForThumbs(html:string) {
        const ctr = document.createElement("div");
        ctr.innerHTML = html;
        const images = ctr.querySelectorAll("img");
        const thumbs = Array.from(images).filter(el => el.dataset.type === undefined).map(el => el.src);
        const posters = ctr.querySelectorAll("[poster]") as NodeListOf<HTMLElement>;
        thumbs.push(...Array.from(posters).filter(el => el.dataset.type === undefined &&
                el.getAttribute("poster") !== "").map(el => el.getAttribute("poster") as string));
        thumbs.length > 0 && this.dispatchEvent(new PageThumbChangeEvent({thumbs}));
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
            event.target.targetElm.dispatchEvent(new TinymceChangeEvent(event.target.getContent()))
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
        onPageSelected: (event:PageSelectedEvent) => {
            const thumb = event.pageModel.toPageThumbnail();
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

    // tell the page we may have some thumbs
    const thumbs:Array<string> = [];
    file.thumbUrl && thumbs.push(file.thumbUrl);
    file.pictureUrl && thumbs.push(file.pictureUrl);
    thumbs.length > 0 && editor.getContainer().dispatchEvent(new PageThumbChangeEvent({thumbs}));


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

class TinymceChangeEvent extends Event {
    static eventType = "change";
    value:string;
    constructor(value:string) {
        super(TinymceChangeEvent.eventType, {bubbles:true, composed: true});
        this.value = value;
    }
}


declare global {
    interface Window { tinymceSettings: ITinyMceSettings; }
    interface HTMLElementTagNameMap {
        'hb-text-content': TextContent
    }
}
