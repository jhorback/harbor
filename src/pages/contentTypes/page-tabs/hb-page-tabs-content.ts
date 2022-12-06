import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import "../../../common/hb-button";
import { HbPageContent } from "../../hb-page";
import { PageTabsContentController } from "./PageTabsContentController";

/**
 */
@customElement('hb-page-tabs-content')
export class PageTabsContent extends LitElement {

    get stateId() { return this.pathname; }

    @property({type:String})
    pathname:string = "";

    @property({type:Number, attribute: "content-index"})
    contentIndex:number = -1;

    pageTabsContent:PageTabsContentController = new PageTabsContentController(this);

    @query("hb-page-content")
    $hbPageContent!:HbPageContent;    

    render() {
        const state = this.pageTabsContent.content;
        const contentState = this.pageTabsContent.contentState;
        return html`
            <hb-page-content
                pathname=${this.pathname}
                content-index=${this.contentIndex}
                ?is-empty=${!state.tabs || state.tabs.length === 0}>                
                
                <div slot="edit-toolbar">
                    <!-- NO TOOLBAR //-->
                </div>
                <div slot="page-edit-empty">
                    
                </div>
                <div slot="content-edit">
                   
                </div>
                <div slot="content-edit-tools">
                    
                </div>
            </hb-page-content>
        `;
    }

   

    static styles = [css`
        :host {
            display: block;           
        }       
       
  `];
}




declare global {
    interface HTMLElementTagNameMap {
        'hb-page-tabs-content': PageTabsContent
    }
}
