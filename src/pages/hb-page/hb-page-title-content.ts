import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { ContentEditableChangeEvent } from "../../common/hb-content-editable";
import { IPageData } from "../../domain/interfaces/PageInterfaces";
import { PageTitleThumbOption } from "../../domain/Pages/PageModel";
import { styles } from "../../styles";
import { IPageState, UpdateSubtitleEvent, UpdateTitleEvent } from "./PageController";

/**  
 */
@customElement('hb-page-title-content')
export class PageTitleContent extends LitElement {

    @property({type: Object})
    page!:IPageData;

    @property({type: Object})
    pageState!:IPageState;

    render() {
        const page = this.page;
        const pageState = this.pageState;
        console.log("render title content");

        return this.noTitleContent() ? html`` :  html`

            <div class="page-header-content">
                <div class="title-thumb" style="background-image: url(${page.thumbUrl})">
                    <img src=${page.thumbUrl}>
                </div>                       

                ${pageState.inEditMode ? html`
                    <hb-content-editable
                        ?hidden=${!page.titleContent.showTitle}
                        class="display-medium"
                        value=${page.displayTitle}
                        placeholder="Enter the title"
                        @change=${this.titleChange}
                    ></hb-content-editable>   
                    <hb-content-editable
                        add-border
                        ?hidden=${!page.titleContent.showSubtitle}
                        class="body-large"
                        value=${page.subtitle}
                        placeholder="Enter a subtitle"
                        @change=${this.subtitleChange}
                    ></hb-content-editable>                        
                ` : html`
                    <h1 class="display-medium"
                        ?hidden=${!page.titleContent.showTitle}
                        >${page.displayTitle}
                    </h1>
                    <div class="body-large" ?hidden=${!page.titleContent.showSubtitle}>
                        ${page.subtitle}
                    </div>
                `}
            </div>
        `;
    }

    private noTitleContent() {
        const page = this.pageState.page;
        return page.titleContent.showSubtitle == false &&
            page.titleContent.showTitle == false &&
            page.titleContent.showThumbOption == PageTitleThumbOption.None;
    }

    private subtitleChange(event:ContentEditableChangeEvent) {
        this.dispatchEvent(new UpdateSubtitleEvent(event.value));
    }

    private titleChange(event:ContentEditableChangeEvent) {
        this.dispatchEvent(new UpdateTitleEvent(event.value));
    }

    static styles = [styles.types, css`
        :host {
            display: block;
            padding: 56px;
            background-color: var(--md-sys-color-surface);
            border-radius: var(--md-sys-shape-corner-large);
        }

        .page-header-content {
            display: grid;
            gap: 1rem;
            grid-template-columns: auto 1fr;
            max-width: var(--hb-page-layout-small);
        }

        .page-header-content > :first-child {
            background-color: red;
            grid-row: 1 / span 2;
        }

        .title-thumb {
            overflow: hidden;
            background-size: cover;
            width: 150px;
            height: 150px;
            border-radius:  var(--md-sys-shape-corner-medium);
        }
        
  `]
}



declare global {
  interface HTMLElementTagNameMap {
    'hb-page-title-content': PageTitleContent
  }
}
