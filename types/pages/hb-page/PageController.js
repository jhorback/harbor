var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { StateController, stateProperty } from "@domx/statecontroller";
import { PageModel } from "../../domain/Pages/PageModel";
export class UpdateShowTitleEvent extends Event {
    constructor(showTitle) {
        super(UpdateShowTitleEvent.eventType);
        this.showTitle = showTitle;
    }
}
UpdateShowTitleEvent.eventType = "update-show-title";
export class UpdateShowSubtitleEvent extends Event {
    constructor(showSubtitle) {
        super(UpdateShowSubtitleEvent.eventType);
        this.showSubtitle = showSubtitle;
    }
}
UpdateShowSubtitleEvent.eventType = "update-show-subtitle";
export class UpdateSubtitleEvent extends Event {
    constructor(subtitle) {
        super(UpdateSubtitleEvent.eventType);
        this.subtitle = subtitle;
    }
}
UpdateSubtitleEvent.eventType = "update-subtitle";
export class UpdateDocContentEvent extends Event {
    constructor(index, state) {
        super(UpdateDocContentEvent.eventType, { bubbles: true, composed: true });
        if (!(index > -1)) {
            throw new Error("index must be 0 or greater");
        }
        this.index = index;
        this.state = state;
    }
}
UpdateDocContentEvent.eventType = "update-doc-content";
export class MovePageContentEvent extends Event {
    constructor(index, moveUp) {
        super(MovePageContentEvent.eventType, { bubbles: true, composed: true });
        this.index = index;
        this.moveUp = moveUp;
    }
}
MovePageContentEvent.eventType = "move-page-content";
export class PageThumbChangeEvent extends Event {
    constructor(options) {
        super(PageThumbChangeEvent.eventType, { bubbles: true, composed: true });
        this.thumbs = options.thumbs;
        this.setIndex = options.setIndex;
        this.removeIndex = options.removeIndex;
    }
}
PageThumbChangeEvent.eventType = "doc-thumb-change";
export class PageController extends StateController {
    // @inject<IEditDocRepo>(EditDocRepoKey)
    // private editDocRepo!:IEditDocRepo;
    constructor(host) {
        super(host);
        this.state = {
            isLoaded: false,
            currentUserCanEdit: true,
            currentUserCanAdd: true,
            page: new PageModel()
        };
    }
}
__decorate([
    stateProperty()
], PageController.prototype, "state", void 0);
