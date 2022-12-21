import { css, html, LitElement } from "lit";
import { customElement, property, query } from "lit/decorators.js";
import { HbPage } from "../hb-page";
import { PageRndererController, PathnameChangedEvent } from "./PageRendererController";


@customElement("hb-page-renderer")
export class HbPageRenderer extends LitElement {

    @property({type: String})
    pathname!:string;

    pageRenderer:PageRndererController = new PageRndererController(this);

    @query("hb-page")
    $hbPage!:HbPage;

    attributeChangedCallback(name:string, oldValue:string, newValue:string) {
        super.attributeChangedCallback(name, oldValue, newValue);
        if (name === "pathname") {
            console.debug("pathname changed from", oldValue, "to", newValue);
            this.dispatchEvent(new PathnameChangedEvent(newValue));
        }
    }

    render() {
        const state = this.pageRenderer.state;
        return html`
            ${state.isLoading ? html`
                <div>
                    Loading...
                </div>
            ` : html``}

            ${!state.isLoading && state.pathname ? html`
                <hb-page pathname=${state.pathname}></hb-page> 
            ` : html``}           
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
      "hb-page-renderer": HbPageRenderer
    }
  }