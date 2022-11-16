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

    page:PageController = new PageController(this.host);

    get content():TContentType {
        return this.page.state.page.content[this.host.contentIndex] as TContentType;
    }

    get state():IPageContentState {
        return {
            inContentEditMode: this.host.contentIndex === this.page.state.activeContentIndex,
            isActive: this.host.contentIndex === this.page.state.activeContentIndex,
            canMoveUp: this.contentIndex > 0,
            canMoveDown: this.contentIndex < this.page.state.page.content.length - 1
        };
    }

    constructor(host:IPageContentElement) {
        super(host);
        this.host = host;
    }
}