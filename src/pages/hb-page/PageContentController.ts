import { StateController } from "@domx/statecontroller";
import { IContentType } from "../../domain/interfaces/PageInterfaces";
import { PageController, IPageElement } from "./PageController";



export interface IPageContentState {
    inContentEditMode: boolean;
    isActive: boolean;
    canMoveUp: boolean;
    canMoveDown: boolean;
}

export interface IPageContentElement extends IPageElement {
    contentIndex:number;
}

export class PageContentController<TContentType extends IContentType> extends StateController {

    host:IPageContentElement;

    constructor(host:IPageContentElement) {
        super(host);
        this.host = host;
        this.page = new PageController(this.host);
        this.page.stateUpdated = () => this.stateUpdated();
    }

    page:PageController;
    

    get content():TContentType {
        return this.page.state.page.content[this.host.contentIndex] as TContentType;
    }

    get contentState():IPageContentState {
        return {
            inContentEditMode: this.host.contentIndex === this.page.state.editableContentIndex,
            isActive: this.host.contentIndex === this.page.state.activeContentIndex,
            canMoveUp: this.page.state.editableContentIndex === -1 && this.host.contentIndex > 0,
            canMoveDown: this.page.state.editableContentIndex === -1 && this.host.contentIndex < this.page.state.page.content.length - 1
        };
    }
}