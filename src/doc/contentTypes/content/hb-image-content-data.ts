import { DataElement, StateChange } from "@domx/dataelement";
import { customDataElement, dataProperty } from "@domx/dataelement/decorators";
import { inject } from "../../../domain/DependencyContainer/decorators";
import { FindFileRepoKey, IFindFileRepo } from "../../../domain/interfaces/FileInterfaces";
import { ImageContentDataState } from "../imageContentType";



@customDataElement("hb-image-content-data", {
    eventsListenAt: "self",
    stateIdProperty: "uid"
})
export class ImageContentData extends DataElement {
    static defaultState:ImageContentDataState = new ImageContentDataState();

    get uid():string { return this.getAttribute("uid") || ""; }
    set uid(uid:string) { this.setAttribute("uid", uid); }

    connectedCallback(): void {
        super.connectedCallback();
    }
    
    @dataProperty()
    state = ImageContentData.defaultState;

    @inject<IFindFileRepo>(FindFileRepoKey)
    private findFileRepo!:IFindFileRepo;
}
