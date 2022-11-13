import { html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";


@customElement("hb-page-renderer")
export class HbPageRenderer extends LitElement {

    @property({type: String})
    pathname!:string;

    render() {
        return html`
            <hb-page pathname=${location.pathname.toLowerCase()}></hb-page>
        `;
    }
}


declare global {
    interface HTMLElementTagNameMap {
      "hb-page-renderer": HbPageRenderer
    }
  }