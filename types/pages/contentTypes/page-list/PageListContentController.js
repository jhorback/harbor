var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Product } from "@domx/statecontroller";
import { hostEvent } from "@domx/statecontroller";
import "../../../domain/Files/HbFindFileRepo";
import { PageThumbChangeEvent, UpdatePageContentEvent } from "../../hb-page";
import { PageContentController } from "../../hb-page/PageContentController";
export class AddListPageEvent extends Event {
    constructor(page) {
        super(AddListPageEvent.eventType);
        this.page = page;
    }
}
AddListPageEvent.eventType = "add-list-page";
export class ChangePageListDisplayEvent extends Event {
    constructor(display) {
        super(ChangePageListDisplayEvent.eventType);
        this.display = display;
    }
}
ChangePageListDisplayEvent.eventType = "change-page-list-display";
export class PageListContentController extends PageContentController {
    constructor() {
        super(...arguments);
        this.state = { ...this.content };
    }
    stateUpdated() {
        this.state = { ...this.content };
    }
    addListPage(event) {
        Product.of(this)
            .next(addPage(event.page))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state))
            .tap(sendThumb(event.page));
    }
    changeDisplay(event) {
        Product.of(this)
            .next(setDisplay(event.display))
            .requestUpdate(event)
            .dispatchHostEvent(new UpdatePageContentEvent(this.host.contentIndex, this.state));
    }
}
__decorate([
    hostEvent(AddListPageEvent)
], PageListContentController.prototype, "addListPage", null);
__decorate([
    hostEvent(ChangePageListDisplayEvent)
], PageListContentController.prototype, "changeDisplay", null);
const sendThumb = (page) => (product) => {
    if (page.thumbUrl) {
        product.dispatchHostEvent(new PageThumbChangeEvent({
            thumbs: [page.thumbUrl]
        }));
    }
};
const addPage = (page) => (state) => {
    state.pages.push(page);
};
const setDisplay = (display) => (state) => {
    state.display = display;
};
// todo - sync with db method for syncing updates
