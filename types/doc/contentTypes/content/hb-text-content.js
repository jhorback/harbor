var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TextContent_1;
import { html, css, LitElement } from "lit";
import { customElement, property, state } from "lit/decorators.js";
import { unsafeHTML } from "lit/directives/unsafe-html.js";
import { styles } from "../../../styles";
import { UpdateDocContentEvent } from "../../data/hb-doc-data";
import { TextContentData } from "../textContentType";
/**
 */
let TextContent = TextContent_1 = class TextContent extends LitElement {
    constructor() {
        super(...arguments);
        this.index = -1;
        this.inDocEditMode = false;
        this.state = TextContent_1.defaultState;
        this.inEditMode = false;
    }
    render() {
        return this.inEditMode ? html `
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
        ` : html `
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
    tinymceChange(event) {
        this.dispatchEvent(new UpdateDocContentEvent(this.index, TextContentData.of(event.value)));
    }
};
TextContent.defaultState = new TextContentData();
TextContent.styles = [styles.types, styles.dialog, css `
        :host {
            display: block;
        }
        :host([doc-edit]:hover) {
            background-color: var(--md-sys-color-surface-variant);
        }
  `];
__decorate([
    property({ type: String }),
    property({ type: Number })
], TextContent.prototype, "index", void 0);
__decorate([
    property({ type: Boolean, attribute: "doc-edit" })
], TextContent.prototype, "inDocEditMode", void 0);
__decorate([
    property({ type: Object })
], TextContent.prototype, "state", void 0);
__decorate([
    state()
], TextContent.prototype, "inEditMode", void 0);
TextContent = TextContent_1 = __decorate([
    customElement('hb-text-content')
], TextContent);
export { TextContent };
if (!window.tinymceChangeHandler) {
    window.tinymceChangeHandler = (event) => {
        event.target.targetElm.dispatchEvent(new ChangeEvent(event.level.content));
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
