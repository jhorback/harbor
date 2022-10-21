var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { FileUploadStatusData } from "./FileUploaderClient";
/**
 */
let UploadStatusPanel = class UploadStatusPanel extends LitElement {
    constructor() {
        super(...arguments);
        this.state = new FileUploadStatusData();
    }
    render() {
        return html `
            ${JSON.stringify(this.state)}
        `;
    }
};
// need to remove from dome when complete
// document.removeChild(this.statusPanel);
UploadStatusPanel.styles = [css `
        :host {
            display: block;
        }
    `];
__decorate([
    property({ type: Object })
], UploadStatusPanel.prototype, "state", void 0);
UploadStatusPanel = __decorate([
    customElement('hb-upload-status-panel')
], UploadStatusPanel);
export { UploadStatusPanel };
/*


will have events to

CancelUploadEvent
OverwriteFileEvent


UI TO SHOW

--- default
thumb || default image
text: on file 4 of 10 (59% complete)
[CANCEL]

--- if requires overwrite
thumb || default image
File exists. Overwrite?
[SKIP][OVERWRITE]

--- if complete
close toast and send feedback
Upload complete
Or upload complete (with errors) (log errors to the console)




export class FileUploadStatusData {
    requiresOverwrite:boolean = false;
    requiresOverwriteFileIndex:number = -1;
    hasErrors:boolean = false;
    errorMessages:Array<string> = new Array();
    isComplete:boolean = false;
    highlightFileSrc:string|null = null;
}

*/
