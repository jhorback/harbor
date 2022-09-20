import { html, css, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import "../doc/hb-doc-page";
import "../domain/SystemAdmin/HbHomePageRepo";
import { inject } from "../domain/DependencyContainer/decorators";
import { IDocumentReference, IHomePageRepo, HomePageRepoKey } from "../domain/interfaces/DocumentInterfaces";
import { sendFeedback } from "../common/feedback";
import { docTypes } from "../domain/Doc/docTypes";


/**
 * The job of this element is to look the home page
 * document up in the database and append the correct element to the dom
 * 
 * // todo: use the hb-system-admin-data to load the homePageRef
 */
@customElement('hb-home')
export class HbHome extends LitElement {

    @inject<IHomePageRepo>(HomePageRepoKey)
    private homePageRepo!:IHomePageRepo;

    @query("#home-container")
    $homeContainer!:HTMLElement;

    async connectedCallback() {
        super.connectedCallback();

        // need to wait since the element needs to render
        // the home-container
        await this.updateComplete;

        const homePageRef = this.getHomePageFromLocalStorage();
        if (homePageRef) {
            this.showHomePage(homePageRef);
        }

        const dbHomePageRef = await this.homePageRepo.getHomePageRef();
        if (!homePageRef || homePageRef.uid !== dbHomePageRef?.uid) {
            this.showHomePage(dbHomePageRef);
            localStorage.setItem("homePageRef", JSON.stringify(dbHomePageRef));
        }
    }

    private getHomePageFromLocalStorage():IDocumentReference|null {
        const homePageRefStr = localStorage.getItem("homePageRef");
        if (!homePageRefStr) {
            return null;
        }
        try {
            return JSON.parse(homePageRefStr) as IDocumentReference|null;
        }
        catch {
            return null;
        }
    }

    private showHomePage(homePageRef:IDocumentReference|null) {
        if (homePageRef === null) {
            this.showNotFound("The home page is not configured");
            sendFeedback({
                message: "The home page is not configured",
                actionText: "Settings",
                actionHref: "/profile/admin"
            });
            return;
        } 

        // verify the docType exists
        const docType = docTypes[homePageRef.docType];
        if (!docType) {
            this.showNotFound(`The docType was not found: ${homePageRef.docType}`);
            return;
        }

        // verify the custom element has been defined
        const el = docType.element;
        if (customElements.get(el) === undefined) {
            this.showNotFound(`The docType element was not defined: ${el}`);
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

    private showNotFound(warn:string) {
        console.warn(warn);
        const notFoundEl = document.createElement("hb-route-not-found-page");
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(notFoundEl);
    }

    render() {
        return html`
            <div id="home-container">
                Loading... can store in local storage and then check db to see if home is different.
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
