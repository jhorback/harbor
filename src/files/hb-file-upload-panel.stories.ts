import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { FileUploadPanel as Panel, FileUploaderAccept } from "./hb-file-upload-panel";
import { extractMediaTags, convertPictureToBase64Src, convertPictureToFile } from "../domain/Files/extractMediaTags";
import { CancelUploadEvent, FileUploadController, FileUploadError, FileUploadState, OverwriteFileEvent } from './FileUploadController';
import { hostEvent } from '@domx/statecontroller';
import { resizeImageFile } from '../domain/Files/resizeImageFile';
import { TextInput } from '../common/hb-text-input';

export default {
    title: 'App/File Upload Panel',
    component: "hb-file-upload-panel",
    argTypes: { },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["overwrite-file", "cancel-upload"],
        }
    }
} as Meta;


class MockStateChangeEvent extends Event {
    static eventType = "mock-state-change";
    state:FileUploadState;
    constructor(state:FileUploadState) {
        super(MockStateChangeEvent.eventType);
        this.state = state;
    }
};

class MockFileUploadController extends FileUploadController {
    openFileSelector() {
        console.log("MockFileUploadController: openFileSelector called.")
    }
    
    @hostEvent(OverwriteFileEvent)
    overwriteFile(event:OverwriteFileEvent) {
        alert("MockFileUploadController: Overwrite file")
    }

    @hostEvent(CancelUploadEvent)
    cancelUpload(event:CancelUploadEvent) {
        alert("MockFileUploadController: Cancel upload")
    }

    @hostEvent(MockStateChangeEvent)
    mockStateChange(event: MockStateChangeEvent) {
        this.state = event.state;
        this.requestUpdate(event);
    }
}


Panel.fileUploaderType = MockFileUploadController;



 
const FileUploadPanelTemplate = () => html`
    <button @click=${createElement}>Open</button>
    <button @click=${clickedButton("uploading1")}>Uploading 1</button>
    <button @click=${clickedButton("uploading2")}>Uploading 2</button>
    <button @click=${clickedButton("requiresOverwrite")}>Requires Overwrite</button>
    <button @click=${clickedButton("complete")}>Complete</button>
    <button @click=${clickedButton("doneWithSkipped")}>Complete With Skipped</button>
    <button @click=${closeElement}>Close</button>
    
    <div>
        <h2>extractMediaTags Test</h2>
        <p>Use jsmediatags to pull out meta data</p>
        <input type="file" @change=${MediaTagTest.onInputChange}>
    </div>
    
    <div>
        <h2>Image Re-sizer Test</h2>
        <input type="file" @change=${ImageSizerTest.onInputChange}>
        <div>
            <h3>Resized Image</h3>
            <div><input type="text" value="1280" id="max-size" style="width:100px; line-height:1.2rem; margin-bottom:12px"></div>
            <div id="resized-ctr"></div>
        </div>
    </div>
`;


class ImageSizerTest {
    static async onInputChange(event:Event) {
        //@ts-ignore
        const file = event.target.files[0];
        const size = (document.getElementById("max-size") as TextInput).value;    
        const resizedFile = await resizeImageFile(file, parseInt(size), " THUMB");
        
        const img = document.createElement("img");
        img.src = URL.createObjectURL(resizedFile.file);
        const ctr = document.getElementById("resized-ctr")!;
        ctr.innerHTML = "";
        ctr.appendChild(img);
        MediaTagTest.addMessageDiv("Resized Image Dimensions", {
            ...resizedFile,
            fileName: resizedFile.file.name
        });
    }
}



class MediaTagTest {
    static async onInputChange(event:Event) {
        //@ts-ignore
        const file = event.target.files[0];
    
        try {
            const tags = await extractMediaTags(file);
            
            var img = document.createElement("img");
            if (!tags.picture) {
                throw new Error("Picture data does not exist");
            }
            img.src = convertPictureToBase64Src(tags.picture);
            document.body.appendChild(img);

            img = document.createElement("img");
            const pictureFile = convertPictureToFile(file.name, tags.picture);
            img.src = URL.createObjectURL(pictureFile);
            img.setAttribute("title", pictureFile.name);
            delete tags.picture;
            MediaTagTest.addMessageDiv("Parsed tags", tags);
            document.body.appendChild(img);
        } catch(error) {
            MediaTagTest.addMessageDiv("Caught error", error);
        }
    }

    static addMessageDiv(message:string, data:any){
        const div = document.createElement("div");
        div.innerHTML = `${message}: <pre>${JSON.stringify(data)}</pre>`;
        console.log(message, data);
        document.body.appendChild(div);
    }
}




let panel:Panel|null = null;

const createElement = () => {
    if (!panel || !panel.parentElement) {
        panel = Panel.openFileSelector({
            accept: FileUploaderAccept.images
        });               
    }
    panel.showPanel();
};


const clickedButton = (name:string) => {        
    return (event:Event) => {
        createElement();
        panel?.dispatchEvent(new MockStateChangeEvent(getState(name)));
    };
};

const closeElement = (event:Event) => {
    panel?.close();
    setTimeout(() => {        
        panel?.parentElement?.removeChild(panel);
        panel = null;
    }, 1000);
    
};

export interface FileUploadPanelProps {}


// @ts-ignore 
const Template: Story<Partial<FileUploadPanelProps>> = (args:FileUploadPanelProps) => FileUploadPanelTemplate(args);


export const FileUploadPanel = Template.bind({});
FileUploadPanel.args = {};




function getState(name:string):FileUploadState {
    if (name === "uploading2") {
        return {
            uploadFileTypes: "images",
            onFile: 4,
            ofFile: 10,
            bytesTransferred: 30,
            totalBytes: 100,
            percentComplete: 30,
            errors: [],
            skippedFiles: [],
            highlightFileSrc: getImg(2),
            requiresOverwrite: false,
            requiresOverwriteFileIndex: -1,
            requiresOverwriteFileName: "",
            isComplete: false
        };
    }

    if (name === "requiresOverwrite") {
        return {
            uploadFileTypes: "images",
            onFile: 5,
            ofFile: 10,
            bytesTransferred: 40,
            totalBytes: 100,
            percentComplete: 40,
            errors: [],
            skippedFiles: [],
            highlightFileSrc: getImg(3),
            requiresOverwrite: true,
            requiresOverwriteFileIndex: 7,
            requiresOverwriteFileName: "Bacchus - Into Me.mp3",
            isComplete: false
        };
    }

    if (name === "doneWithSkipped") {
        return {
            uploadFileTypes: "images",
            onFile: 10,
            ofFile: 10,
            bytesTransferred: 100,
            totalBytes: 100,
            percentComplete: 100,
            errors: [
                new FileUploadError({}, new Error("Unauthenticated Error")),
                new FileUploadError({}, new Error("Server Error"))
            ],
            skippedFiles: ["Bacchus - Into Me.mp3", "SR003XY.WAV", "Here is a long file name.sdf", "And another.jpg", "And another long name here 123l1sdfs34.png"],
            highlightFileSrc: null,
            requiresOverwrite: false,
            requiresOverwriteFileIndex: -1,
            requiresOverwriteFileName: "",
            isComplete: true
        };
    }

    if (name === "complete") {
        return {
            uploadFileTypes: "images",
            onFile: 10,
            ofFile: 10,
            bytesTransferred: 100,
            totalBytes: 100,
            percentComplete: 100,
            errors: [],
            skippedFiles: [],
            highlightFileSrc: null,
            requiresOverwrite: false,
            requiresOverwriteFileIndex: -1,
            requiresOverwriteFileName: "",
            isComplete: true
        };
    }

    return {
        uploadFileTypes: "images",
        onFile: 1,
        ofFile: 10,
        bytesTransferred: 10,
        totalBytes: 100,
        percentComplete: 10,
        errors: [],
        skippedFiles: [],
        highlightFileSrc: getImg(1),
        requiresOverwrite: false,
        requiresOverwriteFileIndex: -1,
        requiresOverwriteFileName: "",
        isComplete: false
    };
};

function getImg(num:number) {
    // https://yulvil.github.io/gopherjs/02/
    const img1 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAiklEQVR4nGKJnlvKgA1I3fLCKv40PhGr+A2+3VjFmbCKUhGMWjBqAeWA8QrDXqwSBhNSsYq3BbdjFdeJNcAqPvSDaNSCEWAB47FoZawSy9duxSq+w3cHVvHXfK+wig/9IBq1YARYwPjBWBurRDTzG6zidpN5sIrfLH6BVXzoB9GoBSPAAkAAAAD//wHgF5akIfDqAAAAAElFTkSuQmCC";
    const img2 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAiklEQVR4nGIRtj3BgA0czviGVTzwhQNW8VnBbFjFmbCKUhGMWjBqAeWAsb3lJlaJMz8mYRX/uqoXq/hbyRdYxYd+EI1aMAIsYOy8poNVQmr6Fqzinp6LsIrPv1KNVXzoB9GoBSPAAsbZFa+wSqjeSMMqfo/HA6u45Y5nWMWHfhCNWjACLAAEAAD//zE7GrQQUWQBAAAAAElFTkSuQmCC";
    const img3 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAiklEQVR4nGLxEmFjwAb4GZ5gFX/X/QaruBzTLqziTFhFqQhGLRi1gHLAaLJmK1aJfT0FWMVNdH5gFd+tZYZVfOgH0agFI8ACxs8CDVglTq+TxSounjANq7i5pgxW8aEfRKMWjAALGP3C47FKHN/yGKv4BPfpWMWffJ+IVXzoB9GoBSPAAkAAAAD//1F3FnZbzokvAAAAAElFTkSuQmCC";
    return [img1, img2, img3].at(num - 1) as string;
}






