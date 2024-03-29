var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DocData_1;
import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { DocModel } from "../../domain/Doc/DocModel";
import { docTypes } from "../../domain/Doc/docTypes";
import "../../domain/Doc/HbEditDocRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";
import { HbCurrentUser, UserAction } from "../../domain/HbCurrentUser";
import { EditDocRepoKey } from "../../domain/interfaces/DocumentInterfaces";
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
export class MoveDocContentEvent extends Event {
    constructor(index, moveUp) {
        super(MoveDocContentEvent.eventType, { bubbles: true, composed: true });
        this.index = index;
        this.moveUp = moveUp;
    }
}
MoveDocContentEvent.eventType = "move-doc-content";
export class DocThumbChangeEvent extends Event {
    constructor(options) {
        super(DocThumbChangeEvent.eventType, { bubbles: true, composed: true });
        this.thumbs = options.thumbs;
        this.setIndex = options.setIndex;
        this.removeIndex = options.removeIndex;
    }
}
DocThumbChangeEvent.eventType = "doc-thumb-change";
let DocData = DocData_1 = class DocData extends DataElement {
    constructor() {
        super(...arguments);
        this.state = DocData_1.defaultState;
        this.documentUnsubscribe = null;
    }
    get uid() { return this.getAttribute("uid") || ""; }
    set uid(uid) { this.setAttribute("uid", uid); }
    connectedCallback() {
        super.connectedCallback();
        this.documentSubscribe();
    }
    documentSubscribe() {
        this.documentUnsubscribe = this.editDocRepo.subscribeToDoc(this.uid, subscribeToDoc(this));
    }
    disconnectedCallback() {
        super.disconnectedCallback();
        this.documentUnsubscribe && this.documentUnsubscribe();
    }
    currentUserChanged(event) {
        StateChange.of(this)
            .next(updateUserCanEdit(this.state.doc))
            .next(updateUserCanAdd)
            .dispatch();
    }
    updateShowTitle(event) {
        StateChange.of(this)
            .next(updateShowTitle(event.showTitle))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }
    updateShowSubtitle(event) {
        StateChange.of(this)
            .next(updateShowSubtitle(event.showSubtitle))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }
    updateSubtitle(event) {
        StateChange.of(this)
            .next(updateSubtitle(event.subtitle))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }
    updateDocContent(event) {
        StateChange.of(this)
            .next(updateDocContent(event.index, event.state))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }
    moveContent(event) {
        StateChange.of(this)
            .next(moveContent(event.index, event.moveUp))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }
    docThumb(event) {
        StateChange.of(this)
            .next(updateThumbs(event.thumbs))
            .next(setThumb(event.setIndex))
            .next(removeThumb(event.removeIndex))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }
};
DocData.defaultState = {
    isLoaded: false,
    currentUserCanEdit: false,
    currentUserCanAdd: false,
    doc: new DocModel()
};
__decorate([
    dataProperty()
], DocData.prototype, "state", void 0);
__decorate([
    inject(EditDocRepoKey)
], DocData.prototype, "editDocRepo", void 0);
__decorate([
    event(HbCurrentUserChangedEvent.eventType, {
        listenAt: "window",
        stopImmediatePropagation: false
    })
], DocData.prototype, "currentUserChanged", null);
__decorate([
    event(UpdateShowTitleEvent.eventType)
], DocData.prototype, "updateShowTitle", null);
__decorate([
    event(UpdateShowSubtitleEvent.eventType)
], DocData.prototype, "updateShowSubtitle", null);
__decorate([
    event(UpdateSubtitleEvent.eventType)
], DocData.prototype, "updateSubtitle", null);
__decorate([
    event(UpdateDocContentEvent.eventType)
], DocData.prototype, "updateDocContent", null);
__decorate([
    event(MoveDocContentEvent.eventType)
], DocData.prototype, "moveContent", null);
__decorate([
    event(DocThumbChangeEvent.eventType)
], DocData.prototype, "docThumb", null);
DocData = DocData_1 = __decorate([
    customDataElement("hb-doc-data", {
        eventsListenAt: "parent",
        stateIdProperty: "uid"
    })
], DocData);
export { DocData };
const subscribeToDoc = (docData) => (doc) => {
    StateChange.of(docData)
        .next(updateDoc(doc))
        .next(updateUserCanEdit(doc))
        .next(updateUserCanAdd)
        .dispatch();
};
const moveContent = (index, moveUp) => (state) => {
    const content = state.doc.content;
    if ((moveUp && index === 0) || (!moveUp && index === content.length - 1)) {
        return;
    }
    moveUp ? content.splice(index - 1, 0, content.splice(index, 1)[0]) :
        content.splice(index + 1, 0, content.splice(index, 1)[0]);
};
const saveDoc = (editDocRepo, doc) => (stateChange) => {
    editDocRepo.saveDoc(doc);
};
const updateUserCanEdit = (doc) => (state) => {
    state.currentUserCanEdit = userCanEdit(doc);
};
const updateUserCanAdd = (state) => {
    state.currentUserCanAdd = new HbCurrentUser().authorize(UserAction.authorDocuments);
};
const userCanEdit = (doc) => {
    const currentUser = new HbCurrentUser();
    return currentUser.uid === doc.authorUid
        || currentUser.authorize(UserAction.editAnyDocument);
};
const updateDoc = (doc) => (state) => {
    state.isLoaded = true;
    state.doc = doc;
};
const updateShowTitle = (showTitle) => (state) => {
    state.doc.showTitle = showTitle;
};
const updateShowSubtitle = (showSubtitle) => (state) => {
    state.doc.showSubtitle = showSubtitle;
};
const updateSubtitle = (subtitle) => (state) => {
    state.doc.subtitle = subtitle;
};
const updateDocContent = (index, data) => (state) => {
    state.doc.content[index] = data;
};
const removeThumb = (index) => (state) => {
    if (index === undefined) {
        return;
    }
    state.doc.thumbUrls.splice(index, 1);
};
const setThumb = (index) => (state) => {
    if (index === undefined) {
        return;
    }
    state.doc.thumbUrl = state.doc.thumbUrls[index];
};
const updateThumbs = (thumbs) => (state) => {
    if (!thumbs) {
        return;
    }
    state.doc.thumbUrls.unshift(...thumbs);
    // using set makes sure they are unique
    const thumbUrls = [...new Set(state.doc.thumbUrls)];
    state.doc.thumbUrls = thumbUrls;
    // set the thumb if it is the default
    if (state.doc.thumbUrls[0] && state.doc.thumbUrl === docTypes.get(state.doc.docType).defaultThumbUrl) {
        state.doc.thumbUrl = state.doc.thumbUrls[0];
    }
};
