import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty, event } from "@domx/dataelement/decorators";
import { inject } from "../../domain/DependencyContainer/decorators";
import { DocModel } from "../../domain/Doc/DocModel";
import { EditDocRepoKey, IContentType, IContentTypeRenderOptions, IEditDocRepo, IUnsubscribe } from "../../domain/interfaces/DocumentInterfaces";
import { UserAction, HbCurrentUser } from "../../domain/HbCurrentUser";
import "../../domain/Doc/HbEditDocRepo";
import { HbCurrentUserChangedEvent } from "../../domain/HbAuth";
import { State } from "@storybook/api";


export interface IDocDataState {
    isLoaded: boolean;
    currentUserCanEdit: boolean;
    currentUserCanAdd: boolean;
    doc:DocModel;
}

export class UpdateShowTitleEvent extends Event {
    static eventType = "update-show-title";
    showTitle:boolean;
    constructor(showTitle:boolean) {
        super(UpdateShowTitleEvent.eventType);
        this.showTitle = showTitle;
    }
}

export class UpdateShowSubtitleEvent extends Event {
    static eventType = "update-show-subtitle";
    showSubtitle:boolean;
    constructor(showSubtitle:boolean) {
        super(UpdateShowSubtitleEvent.eventType);
        this.showSubtitle = showSubtitle;
    }
}

export class UpdateSubtitleEvent extends Event {
    static eventType = "update-subtitle";
    subtitle:string;
    constructor(subtitle:string) {
        super(UpdateSubtitleEvent.eventType);
        this.subtitle = subtitle;
    }
}

export class UpdateDocContentEvent extends Event {
    static eventType = "update-doc-content";
    index:number;
    state:IContentType;
    constructor(index:number, state:IContentType) {
        super(UpdateDocContentEvent.eventType, {bubbles:true, composed:true});
        this.index = index;
        this.state = state;
    }
}

export class MoveDocContentEvent extends Event {
    static eventType = "move-doc-content";
    index:number;
    moveUp:boolean;
    constructor(index:number, moveUp:boolean) {
        super(MoveDocContentEvent.eventType, {bubbles:true, composed:true});
        this.index = index;
        this.moveUp = moveUp;
    }
}


@customDataElement("hb-doc-data", {
    eventsListenAt: "parent",
    stateIdProperty: "uid"
})
export class DocData extends DataElement {
    static defaultState:IDocDataState = {
        isLoaded: false,
        currentUserCanEdit: false,
        currentUserCanAdd: false,
        doc: new DocModel()
    };

    get uid():string { return this.getAttribute("uid") || ""; }
    set uid(uid:string) { this.setAttribute("uid", uid); }

    
    @dataProperty()
    state:IDocDataState = DocData.defaultState;

    @inject<IEditDocRepo>(EditDocRepoKey)
    private editDocRepo!:IEditDocRepo;

    private documentUnsubscribe:IUnsubscribe|null = null;

    connectedCallback(): void {
        super.connectedCallback();
        this.documentSubscribe();
    }

    private documentSubscribe() {
        this.documentUnsubscribe = this.editDocRepo.subscribeToDoc(this.uid,
            subscribeToDoc(this));
    }

    disconnectedCallback(): void {
        super.disconnectedCallback();
        this.documentUnsubscribe && this.documentUnsubscribe();
    }

    @event(HbCurrentUserChangedEvent.eventType, {
        listenAt: "window",
        stopImmediatePropagation: false
    })
    private currentUserChanged(event:HbCurrentUserChangedEvent) {
        StateChange.of(this)
            .next(updateUserCanEdit(this.state.doc))
            .next(updateUserCanAdd)
            .dispatch();
    }

    @event(UpdateShowTitleEvent.eventType)
    private updateShowTitle(event:UpdateShowTitleEvent) {
        StateChange.of(this)
            .next(updateShowTitle(event.showTitle))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }

    @event(UpdateShowSubtitleEvent.eventType)
    private updateShowSubtitle(event:UpdateShowSubtitleEvent) {
        StateChange.of(this)
            .next(updateShowSubtitle(event.showSubtitle))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }

    @event(UpdateSubtitleEvent.eventType)
    private updateSubtitle(event:UpdateSubtitleEvent) {
        StateChange.of(this)
            .next(updateSubtitle(event.subtitle))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }

    @event(UpdateDocContentEvent.eventType)
    private updateDocContent(event:UpdateDocContentEvent) {
        StateChange.of(this)
            .next(updateDocContent(event.index, event.state))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch();
    }

    @event(MoveDocContentEvent.eventType)
    private moveContent(event:MoveDocContentEvent) {
        StateChange.of(this)
            .next(moveContent(event.index, event.moveUp))
            .tap(saveDoc(this.editDocRepo, this.state.doc))
            .dispatch()
            .dispatchEvent(new Event("request-update"));
    }
}


const subscribeToDoc = (docData:DocData) => (doc:DocModel) => {
    StateChange.of(docData)
        .next(updateDoc(doc))
        .next(updateUserCanEdit(doc))
        .next(updateUserCanAdd)
        .dispatch();
};

const moveContent = (index:number, moveUp:boolean) => (state:IDocDataState) => {
    const content = state.doc.content;

    if ((moveUp && index === 0) || (!moveUp && index === content.length -1)) {
        return;
    }

    moveUp ? content.splice(index - 1, 0, content.splice(index, 1)[0]) :
        content.splice(index + 1, 0, content.splice(index, 1)[0]);
};


const saveDoc = (editDocRepo:IEditDocRepo, doc:DocModel) => (stateChange:StateChange) => {
    editDocRepo.saveDoc(doc);
};

const updateUserCanEdit = (doc:DocModel) => (state:IDocDataState) => {
    state.currentUserCanEdit = userCanEdit(doc);
};

const updateUserCanAdd = (state:IDocDataState) => {
    state.currentUserCanAdd = new HbCurrentUser().authorize(UserAction.authorDocuments);
}

const userCanEdit = (doc:DocModel):boolean => {
    const currentUser = new HbCurrentUser();
    return currentUser.uid === doc.authorUid
        || currentUser.authorize(UserAction.editAnyDocument);
}

const updateDoc = (doc:DocModel) => (state:IDocDataState) => {
    state.isLoaded = true;
    state.doc = doc;
};



const updateShowTitle = (showTitle:boolean) => (state:IDocDataState) => {
    state.doc.showTitle = showTitle;
};

const updateShowSubtitle = (showSubtitle:boolean) => (state:IDocDataState) => {
    state.doc.showSubtitle = showSubtitle;
};

const updateSubtitle = (subtitle:string) => (state:IDocDataState) => {
    state.doc.subtitle = subtitle;
};

const updateDocContent = (index:number, data:IContentType) => (state:IDocDataState) => {
    state.doc.content[index] = data;
};

