import { html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { HbPage } from "./hb-page";
import { RequestPageEvent } from "./PageController";


@customElement("hb-page-renderer")
export class HbPageRenderer extends LitElement {

    @property({type: String})
    pathname!:string;

    @query("hb-page")
    $hbPage!:HbPage;

    render() {
        return html`
            <hb-page pathname=${location.pathname.toLowerCase()}></hb-page>
        `;
    }

    updated() {
        this.$hbPage.dispatchEvent(new RequestPageEvent());
    }
}


declare global {
    interface HTMLElementTagNameMap {
      "hb-page-renderer": HbPageRenderer
    }
  }