import { css, html, LitElement } from "lit";
import { customElement, query } from "lit/decorators.js";
import { inject } from "../domain/DependencyContainer/decorators";
import { HomePageRepoKey, IHomePageRepo, IPageReference } from "../domain/interfaces/PageInterfaces";
import { pageTemplates } from "../domain/Pages/pageTemplates";
import "../domain/SystemAdmin/HbHomePageRepo";
import { sendFeedback } from "../layout/feedback";
import { RequestPageEvent } from "../pages/hb-page";


/**
 * The job of this element is to look the home page
 * document up in the database and append the correct element to the dom
 * 
 * // TODO: use the hb-system-admin-data to load the homePageRef
 * Basically, remove the local storage and extra logic from here
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

    private getHomePageFromLocalStorage():IPageReference|null {
        const homePageRefStr = localStorage.getItem("homePageRef");
        if (!homePageRefStr) {
            return null;
        }
        try {
            return JSON.parse(homePageRefStr) as IPageReference|null;
        }
        catch {
            return null;
        }
    }

    private showHomePage(homePageRef:IPageReference|null) {
        if (homePageRef === null) {
            this.showNotFound("The home page is not configured");
            sendFeedback({
                message: "The home page is not configured",
                actionText: "Settings",
                actionHref: "/profile/admin"
            });
            return;
        } 

        // verify the pageTemplate exists
        const pageTemplate = pageTemplates.get(homePageRef.pageTemplate);
        if (!pageTemplate) {
            this.showNotFound(`The page template was not found: ${homePageRef.pageTemplate}`);
            return;
        }

        this.showPage(homePageRef.pathname);
    }

    private showPage(pathname:string) {
        const pageEl = document.createElement("hb-page");
        pageEl.setAttribute("pathname", pathname);
        this.$homeContainer.innerHTML = "";
        this.$homeContainer.append(pageEl);
        pageEl.dispatchEvent(new RequestPageEvent());
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
