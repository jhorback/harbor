import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { styles } from "../../../styles";
import { HbPageContent } from "../../hb-page";
import { PageListContentController } from "./PageListContentController";

/**
 */
@customElement('hb-page-list-content')
export class PageListContent extends LitElement {

    get stateId() { return this.pathname; }

    @property({type:String})
    pathname:string = "";

    @property({type:Number, attribute: "content-index"})
    contentIndex:number = -1;

    pageListContent:PageListContentController = new PageListContentController(this);

    @query("hb-page-content")
    $hbPageContent!:HbPageContent;


    render() {
        const state = this.pageListContent.content;
        return html`
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${false}>                
                <div>
                    PRIMARY CONTENT
                </div>
                <div slot="edit-toolbar">
                    
                </div>
                <div slot="page-edit-empty" @click=${this.clickedEmpty}>
                    EDIT EMPTY CONTENT
                </div>
                <div slot="content-edit">
                    EDIT CONTENT
                </div>
                <div slot="content-edit-tools">
                    EDIT TOOLS
                </div>
            </hb-page-content>
        `;
    }

    private clickedEmpty() {
        this.$hbPageContent.edit();
    }

    static styles = [styles.icons, styles.form, css`
        :host {
            display: block;
            position: relative;
        }
       
        div[slot="content-edit-tools"] {
            padding: 8px;
            display: flex;
            gap: 36px;
        }
        div[slot="content-edit-tools"] > div {
            flex-grow: 1;
        }
        div[slot="content-edit-tools"] > :first-child {
            text-align: right;
        }
        label {
            margin-right: 8px;
        }
  `];
}


declare global {
    interface HTMLElementTagNameMap {
        'hb-page-list-content': PageListContent
    }
}
