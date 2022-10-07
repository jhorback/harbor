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
import { EditDocRepoKey } from "../../domain/interfaces/DocumentInterfaces";
import { UserAction, HbCurrentUser } from "../../domain/HbCurrentUser";
import "../../domain/Doc/HbEditDocRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";
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
const updateDoc = (doc) => (state) => {
    state.isLoaded = true;
    state.doc = doc;
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
