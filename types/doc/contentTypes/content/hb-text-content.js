var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TextContent_1;
import { html, css, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "../../../styles";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { TextContentData } from "../textContentType";
import { HbApp } from "../../../domain/HbApp";
import "../hb-content";
import { FileUploaderAccept, FileUploadPanel } from "../../../files/hb-file-upload-panel";
/**
 */
let TextContent = TextContent_1 = class TextContent extends LitElement {
    constructor() {
        super(...arguments);
        this.contentIndex = -1;
        this.data = TextContent_1.defaultState;
    }
    render() {
        return html `
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
                        bullist numlist indent hr | link image media table | codesample  fullscreen"
                >${this.data.text}</tinymce-editor>
                </div>
            </hb-content>
        `;
    }
    contentActive(event) {
        if (event.active) {
            // @ts-ignore
            import("@tinymce/tinymce-webcomponent");
        }
    }
    textClicked() {
        this.$hbContent.edit();
    }
    tinymceChange(event) {
        this.dispatchEvent(new UpdateDocContentEvent(this.contentIndex, TextContentData.of(event.value)));
    }
};
TextContent.defaultState = new TextContentData();
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
    property({ type: Number })
], TextContent.prototype, "contentIndex", void 0);
__decorate([
    property({ type: Object })
], TextContent.prototype, "data", void 0);
__decorate([
    query("hb-content")
], TextContent.prototype, "$hbContent", void 0);
TextContent = TextContent_1 = __decorate([
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
            text_patterns: true,
            automatic_uploads: true,
            image_title: true,
            file_picker_types: "image media",
            file_picker_callback: (callback, value, meta) => {
                FileUploadPanel.openFileSelector({
                    accept: meta.filetype === "image" ? FileUploaderAccept.images : FileUploaderAccept.media,
                    onUploadComplete: (event) => {
                        event.uploadedFile && callback(event.uploadedFile.url, { title: event.uploadedFile.name });
                    }
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
            event.target.targetElm.dispatchEvent(new ChangeEvent(event.target.getContent()));
        }
    };
}
;
class ChangeEvent extends Event {
    constructor(value) {
        super(ChangeEvent.eventType, { bubbles: true, composed: true });
        this.value = value;
    }
}
ChangeEvent.eventType = "change";
