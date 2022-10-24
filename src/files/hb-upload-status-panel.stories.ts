import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { FileUploadError, FileUploadStatusData } from './FileUploaderClient';
import {UploadStatusPanel as Panel } from "./hb-upload-status-panel";
import { extractMediaTags, convertPictureToBase64Src, convertPictureToFile } from "../domain/Files/extractMediaTags";

export default {
    title: 'App/Upload Status Panel',
    component: "hb-upload-status-panel",
    argTypes: {     
        state: {
            control: { type: 'object' }
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["overwrite-file", "cancel-upload"],
        }
    }
} as Meta;


export interface UploadStatusPanelProps {
    state:FileUploadStatusData;
}

 
const UploadStatusPanelTemplate = ({state}: UploadStatusPanelProps) => html`
    <button @click=${createElement}>Open</button>
    <button @click=${clickedButton("uploading1")}>Uploading 1</button>
    <button @click=${clickedButton("uploading2")}>Uploading 2</button>
    <button @click=${clickedButton("requiresOverwrite")}>Requires Overwrite</button>
    <button @click=${clickedButton("complete")}>Complete</button>
    <button @click=${clickedButton("doneWithSkipped")}>Complete With Skipped</button>
    <button @click=${closeElement}>Close</button>
    <h2>extractMediaTags Test</h2>
    <p>Use jsmediatags to pull out meta data</p>
    <input type="file" @change=${onInputChange}>
`;



const onInputChange = async (event:Event) => {
    //@ts-ignore
    const file = event.target.files[0];

    try {
        const tags = await extractMediaTags(file);
        addMessageDiv("Parsed tags", tags);
        var img = document.createElement("img");
        img.src = convertPictureToBase64Src(tags.picture);
       
        document.body.appendChild(img);
        img = document.createElement("img");
        img.src = URL.createObjectURL(convertPictureToFile("name", tags.picture.data));
        document.body.appendChild(img);
    } catch(error) {
        addMessageDiv("Caught error", error);
    }
};

const addMessageDiv = (message:string, data:any) => {
    const div = document.createElement("div");
    div.innerText = `${message}: ${JSON.stringify(data)}`;
    console.log(message, data);
    document.body.appendChild(div);
}




const clickedButton = (name:string) => {    
    return (event:Event) => {
        createElement();
        const el = document.querySelector("hb-upload-status-panel")!;
        el.state = getState(name);
    };
};


let panel:Panel|null = null;

const createElement = () => {
    if (!panel || !panel.parentElement) {
        panel = Panel.open();
        // moving so storybook captures the events
        document.querySelector("#root-inner")?.appendChild(panel);
    }
};

const closeElement = (event:Event) => {
    panel && panel.close();
    panel = null;
};

// @ts-ignore 
const Template: Story<Partial<UploadStatusPanelProps>> = (args:UploadStatusPanelProps) => UploadStatusPanelTemplate(args);


export const UploadStatusPanel = Template.bind({});
UploadStatusPanel.args = {
    state: getState("uploading1")
};


function getState(name:string):FileUploadStatusData {
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






