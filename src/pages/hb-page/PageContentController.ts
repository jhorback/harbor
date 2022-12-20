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

    get defaultContent():TContentType {
        throw new Error("Not implemented");
    }
    

    get content():TContentType {
        // var contentType =  this.page.state.page.content[this.host.contentIndex];
        // return contentType ? contentType as TContentType : this.defaultContent;

        const contentType =  this.page.state.page.content[this.host.contentIndex];
        if (contentType && contentType.contentType !== this.defaultContent.contentType) {
            console.warn("CONTENT TYPE MISMATCH:", contentType.contentType, "AND", this.defaultContent.contentType);
        }

        // make sure we have content and it matches the correct type
        // otherwise return the default content
        return !contentType ? this.defaultContent :
            contentType.contentType !== this.defaultContent.contentType ?
                this.defaultContent : contentType as TContentType;
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