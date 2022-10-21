import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { styles } from "../styles";
import { FileUploadStatusData } from "./FileUploaderClient";


/**
 */
@customElement('hb-upload-status-panel')
export class UploadStatusPanel extends LitElement {

    @property({type:Object})
    state:FileUploadStatusData = new FileUploadStatusData();

    render() {
        return html`
            ${JSON.stringify(this.state)}
        `;
    }

    // need to remove from dome when complete
    // document.removeChild(this.statusPanel);

    static styles = [css`
        :host {
            display: block;
        }
    `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-upload-status-panel': UploadStatusPanel
  }
}


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
