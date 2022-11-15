var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "../../../common/hb-button";
import "../../../common/hb-horizontal-card";
import "../../../common/hb-text-input";
import { FileSelectedEvent } from "../../../files/hb-find-file-dialog";
import { PageSelectedEvent } from "../../../pages/hb-find-page-dialog";
import { styles } from "../../../styles";
export var TextContentSelectorType;
(function (TextContentSelectorType) {
    TextContentSelectorType["any"] = "any";
    TextContentSelectorType["page"] = "page";
    TextContentSelectorType["image"] = "image";
    TextContentSelectorType["audio"] = "audio";
    TextContentSelectorType["video"] = "video";
    TextContentSelectorType["file"] = "file";
})(TextContentSelectorType || (TextContentSelectorType = {}));
/**
 */
let TextContentSelectorDialog = class TextContentSelectorDialog extends LitElement {
    constructor() {
        super(...arguments);
        this.searchText = "";
    }
    static async openContentSelector(options) {
        const el = document.createElement("hb-text-content-selector-dialog");
        el.addEventListener(PageSelectedEvent.eventType, (event) => options.onPageSelected(event));
        el.addEventListener(FileSelectedEvent.eventType, (event) => options.onFileSelected(event));
        document.body.appendChild(el);
        await el.updateComplete;
        el.open(options.type);
    }
    open(type) {
        if (type === TextContentSelectorType.page) {
            this.insertPage();
        }
        else if (type === TextContentSelectorType.any) {
            this.$dialog.showModal();
        }
        else {
            this.insertContentType(type);
        }
    }
    render() {
        return html `
            <dialog @cancel=${this.close}>
                
                <div class="contents">
                    <div class="center">
                        <span class="material-symbols-outlined">
                            search
                        </span>
                    </div>

                    <h1 class="headline-small center">Search for Content</h1>

                    <hb-button label="Insert Page Link" text-button @click=${this.insertPage}></hb-button>
                    <hb-button label="Insert Media" text-button @click=${this.insertContent}></hb-button>

                    <div class="dialog-buttons">
                        <hb-button
                            text-button
                            label="Cancel"
                            @click=${this.close}
                        ></hb-button>
                    </div>   
                </div>            
                            
            </dialog>
            <hb-find-page-dialog
                @page-selected=${this.pageSelected}
                @cancel=${this.close}
            ></hb-find-page-dialog>
            <hb-find-file-dialog
                @file-selected=${this.fileSelected}
                @cancel=${this.close}
            ></hb-find-file-dialog>
        `;
    }
    insertPage() {
        this.$dialog.close();
        this.$findPageDlg.showModal();
    }
    insertContent(type) {
        this.insertContentType(TextContentSelectorType.file);
    }
    insertContentType(type) {
        this.$dialog.close();
        this.$findFileDlg.setAttribute("file-type", type);
        this.$findFileDlg.open = true;
    }
    pageSelected(event) {
        this.dispatchEvent(new PageSelectedEvent(event.pageModel));
    }
    fileSelected(event) {
        this.dispatchEvent(new FileSelectedEvent(event.file));
    }
    close() {
        this.parentElement?.removeChild(this);
    }
};
TextContentSelectorDialog.styles = [styles.types, styles.dialog, styles.icons, css `
        :host {
            display: block;
            z-index:1;
        }
        .contents {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .center {
            text-align: center;
        }
  `];
__decorate([
    query("dialog")
], TextContentSelectorDialog.prototype, "$dialog", void 0);
__decorate([
    query("hb-find-page-dialog")
], TextContentSelectorDialog.prototype, "$findPageDlg", void 0);
__decorate([
    query("hb-find-file-dialog")
], TextContentSelectorDialog.prototype, "$findFileDlg", void 0);
TextContentSelectorDialog = __decorate([
    customElement('hb-text-content-selector-dialog')
], TextContentSelectorDialog);
export { TextContentSelectorDialog };
