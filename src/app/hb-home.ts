import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "../document/hb-doc-page";
import "../domain/HomePage/HbHomePageRepo";
import { inject } from "../domain/DependencyContainer/decorators";
import { IHomePageRepo, IHomePageRepoKey } from "../domain/interfaces/DocumentInterfaces";
import { sendFeedback } from "../common/feedback";
import { docTypes } from "../document/docTypes";


/**
 * The job of this element is to look the home page
 * document up in the database and append the correct element to the dom
 */
@customElement('hb-home')
export class HbHome extends LitElement {

    @inject<IHomePageRepo>(IHomePageRepoKey)
    private homePageRepo!:IHomePageRepo;

    @query("#home-container")
    $homeContainer!:HTMLElement;

    async connectedCallback() {
        super.connectedCallback();
        const homePageRef = await this.homePageRepo.getHomePageRef();

        // alert if no home page set
        if (homePageRef === null) {
            this.showNotFound();
            sendFeedback({
                message: "The home page is not configured",
                actionText: "Settings",
                actionHref: "/profile/admin"
            });
            return;
        } 

        // verify the custom element has been defined
        const el = docTypes[homePageRef.doctype].element;
        if (customElements.get(el) === undefined) {
            console.log(`The docType element was not defined: ${el}`);
            this.showNotFound();
            return;
        }

        this.showDocElement(el, homePageRef.uid);  
    }

    private showDocElement(el:string, uid:string) {
        const docEl = document.createElement(el);
        docEl.setAttribute("uid", uid);
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(docEl); 
    }

    private showNotFound() {
        const notFoundEl = document.createElement("hb-route-not-found-page");
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(notFoundEl);
    }

    render() {
        return html`
            <div id="home-container">
                <hb-doc-page uid="doc:home"></hb-doc-page>
            </div>            
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
    'hb-home': HbHome
  }
}
