import { hostEvent, Product, StateController, stateProperty, windowEvent } from "@domx/statecontroller";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { NotFoundError } from "../../../domain/Errors";
import { HomePageRepoKey, IHomePageRepo, IPageReference } from "../../../domain/interfaces/PageInterfaces";
import "../../../domain/SystemAdmin/HbHomePageRepo";
import { sendFeedback } from "../../../layout/feedback";
import { PagePathnameChangeEvent, RequestPageEvent } from "../PageController";
import { HbPageRenderer } from "./hb-page-renderer";


interface IPageRendererState {
    isLoading: boolean,
    pathname: string,
    isOnHomePage: boolean
}

export class PathnameChangedEvent extends Event {
    static eventType = "pathname-changed";
    pathname:string;
    constructor(pathname:string) {
        super(PathnameChangedEvent.eventType, {bubbles:true, composed:true});
        this.pathname = pathname;
    }
}



export class PageRndererController extends StateController {

    @stateProperty()
    state:IPageRendererState = {
        isLoading: true,
        pathname: "",
        isOnHomePage: false
    };

    host:HbPageRenderer;

    constructor(pageRenderer:HbPageRenderer) {
        super(pageRenderer);
        this.host = pageRenderer;
    }

    @inject<IHomePageRepo>(HomePageRepoKey)
    private homePageRepo!:IHomePageRepo;

    @windowEvent(PathnameChangedEvent)
    pathnameChanged(event:PathnameChangedEvent) {
        Product.of<IPageRendererState>(this)
            .tap(loadPage(this.homePageRepo, event.pathname));
    }
    
}


const loadPage = (homePageRepo:IHomePageRepo, hostPathname:string) => async (product:Product<IPageRendererState>) => {
    const state = product.getState();

    // dont update pathname if it not changing or we are on home
    if (hostPathname === state.pathname || (hostPathname === "/" && state.isOnHomePage)) {
        return;
    }


    if (hostPathname !== "/") {
        updatePathName(product, hostPathname, false);
        return;
    }

    const homePageRef = getHomePageFromLocalStorage();
    if (homePageRef) {
        updatePathName(product, homePageRef.pathname, true);
    }

    const dbHomePageRef = await homePageRepo.getHomePageRef();
    if (!dbHomePageRef) {
        sendFeedback({
            message: "The home page is not configured",
            actionText: "Settings",
            actionHref: "/profile/admin"
        });
        throw new NotFoundError("Home Page Not Found");
        return;
    }

    if (!homePageRef || homePageRef.uid !== dbHomePageRef?.uid) {
        updatePathName(product, dbHomePageRef.pathname, true);
        localStorage.setItem("homePageRef", JSON.stringify(dbHomePageRef));
    }

};

const updatePathName = (product:Product<IPageRendererState>, pathname:string, isOnHomePage:boolean) => {
    product
        .next(setPathname(pathname))
        .next(setIsOnHomePage(isOnHomePage))
        .next(setIsLoading(false))
        .requestUpdate("PageRendererController.updatePathName")
        .tap(requestPage);
};


const setPathname = (pathname:string) => (state:IPageRendererState) => {
    state.pathname = pathname.toLowerCase();
};


const setIsLoading = (isLoading:boolean) => (state:IPageRendererState) => {
    state.isLoading = isLoading;
};

const setIsOnHomePage = (isOnHomePage:boolean) => (state:IPageRendererState) => {
    state.isOnHomePage = isOnHomePage;
};


const requestPage = async (product:Product<IPageRendererState>) => {
    const state = product.getState();
    const pageRenderer = (product.controller.host as HbPageRenderer);
    await pageRenderer.updateComplete;
    window.dispatchEvent(new PagePathnameChangeEvent(state.pathname));
    pageRenderer.$hbPage.dispatchEvent(new RequestPageEvent());
};


const getHomePageFromLocalStorage = ():IPageReference|null => {
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
};