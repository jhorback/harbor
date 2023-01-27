import { StateController } from "@domx/statecontroller";
import { IContentType } from "../../domain/interfaces/PageInterfaces";
import { PageController, IPageElement } from "./PageController";
import { contentTypes } from "../../domain/Pages/contentTypes";



export interface IPageContentState {
    contentTypeName: string;
    inContentEditMode: boolean;
    otherActive: boolean;
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
        // make sure we have content and it matches the correct type
        // otherwise return the default content
        const contentType =  this.page.state.page.content[this.host.contentIndex];
        return !contentType ? this.defaultContent :
            contentType.contentType !== this.defaultContent.contentType ?
                this.defaultContent : contentType as TContentType;
    }

    get contentState():IPageContentState {
        return {
            contentTypeName: this.getContentTypeName(),
            inContentEditMode: this.host.contentIndex === this.page.state.editableContentIndex,
            otherActive: this.page.state.activeContentIndex !== -1 && this.host.contentIndex !== this.page.state.activeContentIndex,
            canMoveUp: this.page.state.editableContentIndex === -1 && this.host.contentIndex > 0,
            canMoveDown: this.page.state.editableContentIndex === -1 && this.host.contentIndex < this.page.state.page.content.length - 1
        };
    }

    private getContentTypeName():string{
        try {
            const content =  this.page.state.page.content[this.host.contentIndex];
            return contentTypes.all().find(c => content.contentType === c.type)?.name || "Content";
        } catch(e) {
            return "Content Error";
        }
    }
}