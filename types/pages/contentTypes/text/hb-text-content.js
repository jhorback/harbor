var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { HbApp } from "../../../domain/HbApp";
import { FileType } from "../../../domain/interfaces/FileInterfaces";
import { FileUploaderAccept, FileUploadPanel } from "../../../files/hb-file-upload-panel";
import { styles } from "../../../styles";
import { PageThumbChangeEvent, UpdatePageContentEvent } from "../../hb-page";
import { PageContentController } from "../../hb-page/PageContentController";
import { TextContentSelectorDialog, TextContentSelectorType } from "./hb-text-content-selector-dialog";
import { TextContentData } from "./textContentType";
/**
 */
let TextContent = class TextContent extends LitElement {
    constructor() {
        super(...arguments);
        this.pageContent = new PageContentController(this);
        this.pathname = "";
        this.contentIndex = -1;
    }
    get stateId() { return this.pathname; }
    render() {
        const content = this.pageContent.content;
        return html `
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
    contentActive(event) {
        if (event.options.isActive) {
            // @ts-ignore
            import("@tinymce/tinymce-webcomponent");
            // need to programmatically create the tinymce element to account for moving content
            // when it is in the dom, the content.text is held on to 
            const container = this.shadowRoot?.querySelector("[slot=content-edit]");
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
            tiny.addEventListener("change", (event) => this.tinymceChange(event));
            this.$contentEditSlot.appendChild(tiny);
        }
    }
    textClicked() {
        this.$hbPageContent.edit();
    }
    tinymceChange(event) {
        this.checkForThumbs(event.value);
        this.dispatchEvent(new UpdatePageContentEvent(this.contentIndex, TextContentData.of(event.value)));
    }
    checkForThumbs(html) {
        const ctr = document.createElement("div");
        ctr.innerHTML = html;
        const images = ctr.querySelectorAll("img");
        const thumbs = Array.from(images).filter(el => el.dataset.type === undefined).map(el => el.src);
        const posters = ctr.querySelectorAll("[poster]");
        thumbs.push(...Array.from(posters).filter(el => el.dataset.type === undefined &&
            el.getAttribute("poster") !== "").map(el => el.getAttribute("poster")));
        thumbs.length > 0 && this.dispatchEvent(new PageThumbChangeEvent({ thumbs }));
    }
};
TextContent.styles = [styles.types, styles.format, css `
        :host {
            display: block;
        }
        .clearfix::after {
            content: "";
            clear: both;
            display: table;
        }
  `];
__decorate([
    property({ type: String })
], TextContent.prototype, "pathname", void 0);
__decorate([
    property({ type: Number, attribute: "content-index" })
], TextContent.prototype, "contentIndex", void 0);
__decorate([
    query("hb-page-content")
], TextContent.prototype, "$hbPageContent", void 0);
__decorate([
    query("[slot=content-edit]")
], TextContent.prototype, "$contentEditSlot", void 0);
TextContent = __decorate([
    customElement('hb-text-content')
], TextContent);
export { TextContent };
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
            setup: (editor) => {
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
                { title: 'Heading 2', block: 'h3', attributes: { class: 'headline-small' } },
                { title: 'Heading 3', block: 'h4', attributes: { class: 'title-large' } },
                { title: "Quote", format: "blockquote" },
                { title: "Paragraph", format: "p" },
            ]
        },
        changeHandler: (event) => {
            event.target.targetElm.dispatchEvent(new TinymceChangeEvent(event.target.getContent()));
        }
    };
}
const onHarborSearch = (editor) => () => {
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
        onPageSelected: (event) => {
            const thumb = event.pageModel.toPageThumbnail();
            const content = `<a href="${thumb.href}" title="${thumb.title}" data-type="page">${thumb.title}</a>`;
            editor.selection.select(selectedNode);
            editor.insertContent(content);
        },
        onFileSelected: (event) => {
            insertFile(selectedNode, editor, { ...event.file, fileDbPath: "" });
        }
    });
};
const onHarborUpload = (editor) => () => {
    const selectedNode = editor.selection.getNode();
    const selectedTag = selectedNode.tagName;
    const accept = selectedTag === "IMG" ? FileUploaderAccept.images :
        (selectedTag === "VIDEO" || selectedNode.querySelector("video") !== null) ?
            FileUploaderAccept.media : FileUploaderAccept.all;
    FileUploadPanel.openFileSelector({
        accept,
        onUploadComplete: (event) => {
            event.uploadedFile && insertFile(selectedNode, editor, event.uploadedFile);
        }
    });
};
const insertFile = (selectedNode, editor, file) => {
    const fileType = file.type?.indexOf("image") === 0 ? FileType.image :
        file.type?.indexOf("audio") === 0 ? FileType.audio :
            file.type?.indexOf("video") === 0 ? FileType.video : FileType.file;
    // tell the page we may have some thumbs
    const thumbs = [];
    file.thumbUrl && thumbs.push(file.thumbUrl);
    file.pictureUrl && thumbs.push(file.pictureUrl);
    thumbs.length > 0 && editor.getContainer().dispatchEvent(new PageThumbChangeEvent({ thumbs }));
    let content = "";
    if (fileType === FileType.image) {
        content = `<img src="${file.url}" title="${file.name}" alt="${file.name}" data-type="image">`;
    }
    else if (fileType === FileType.audio || fileType === FileType.video) {
        content = `<video controls poster="${file.pictureUrl || ""}"
            width="${file.width || (fileType === FileType.audio ? 300 : "")}"
            height="${file.height || (fileType === FileType.audio ? 50 : "")}"
            data-type="${fileType}">
                <source src="${file.url}" type="${file.type}">
            </video>
            `;
    }
    else {
        content = `<a href="${file.url}" target="_blank" title="${file.name}" data-type="file">${file.name}</a>`;
    }
    editor.selection.select(selectedNode);
    editor.insertContent(content);
};
;
class TinymceChangeEvent extends Event {
    constructor(value) {
        super(TinymceChangeEvent.eventType, { bubbles: true, composed: true });
        this.value = value;
    }
}
TinymceChangeEvent.eventType = "change";
