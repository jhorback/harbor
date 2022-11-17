import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "../../../common/hb-button";
import "../../../common/hb-horizontal-card";
import "../../../common/hb-text-input";
import { FileSelectedEvent, FindFileDialog } from "../../../files/hb-find-file-dialog";
import { FindPageDialog, PageSelectedEvent } from "../../../pages/hb-find-page-dialog";
import { styles } from "../../../styles";


export enum TextContentSelectorType {
    any = "any", // opens page or file chooser
    page = "page", // opens page chooser
    image = "image", // opens file chooser
    audio = "audio",
    video = "video",
    file = "file"
}

export interface ITextContentSelectorOptions {
    type:TextContentSelectorType;
    onFileSelected: (event:FileSelectedEvent) => void;
    onPageSelected: (event:PageSelectedEvent) => void;
}

/**  
 */
@customElement('hb-text-content-selector-dialog')
export class TextContentSelectorDialog extends LitElement {

    static async openContentSelector(options:ITextContentSelectorOptions) {
        const el = document.createElement("hb-text-content-selector-dialog") as TextContentSelectorDialog;
        el.addEventListener(PageSelectedEvent.eventType, (event:Event) =>
            options.onPageSelected(event as PageSelectedEvent));
        el.addEventListener(FileSelectedEvent.eventType, (event:Event) =>
            options.onFileSelected(event as FileSelectedEvent));
        document.body.appendChild(el);
        await el.updateComplete;
        el.open(options.type);
    }

    open(type:TextContentSelectorType) {
        if (type === TextContentSelectorType.page) {
            this.insertPage();
        } else if (type === TextContentSelectorType.any) {
            this.$dialog.showModal();
        } else {
            this.insertContentType(type);
        }
    }

    @query("dialog")
    $dialog!:HTMLDialogElement;

    searchText = "";

    render() {
        return html`
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

    @query("hb-find-page-dialog")
    $findPageDlg!:FindPageDialog;

    @query("hb-find-file-dialog")
    $findFileDlg!:FindFileDialog;

    insertPage() {
        this.$dialog.close();
        this.$findPageDlg.showModal();
    }

    insertContent(type?:TextContentSelectorType) {
        this.insertContentType(TextContentSelectorType.file);
    }

    insertContentType(type:TextContentSelectorType) {
        this.$dialog.close();
        this.$findFileDlg.setAttribute("file-type", type);
        this.$findFileDlg.open = true;
    }

    pageSelected(event:PageSelectedEvent) {
        this.dispatchEvent(new PageSelectedEvent(event.pageModel));
    }

    fileSelected(event:FileSelectedEvent) {
        this.dispatchEvent(new FileSelectedEvent(event.file));
    }

    close() {
        this.parentElement?.removeChild(this);
    }

    static styles = [styles.types, styles.dialog, styles.icons, css`
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
  `]
}



declare global {
  interface HTMLElementTagNameMap {
    'hb-text-content-selector-dialog': TextContentSelectorDialog
  }
}
