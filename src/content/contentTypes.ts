import { IContentType } from "../domain/interfaces/DocumentInterfaces";



export class TextContent implements IContentType {
    contentType = "text";
    text = "";
}


interface IContentTypeDescriptor {
    type: string;
    name: string;
    description: string;
    element: string;
}

export const contentTypes:{[key:string]: IContentTypeDescriptor} = {
    text: {
        type: "text",
        name: "Text",
        description: "A rich text field",
        element: "hb-text-content"
    },
    image: {
        type: "image",
        name: "Image",
        description: "An image in the format of jpg, gif, png, etc.",
        element: "hb-image-content"
    }
    /*
    * Grid (thumb views of a collection of document links)
    * Audio (hb-audio-content)
    * SongLink - link to song document; may have different display settings
    * SongList - links to a list of songs
    * YouTube (hb-youtube-content)
    * YouTubeList (hb-youtube-list-content)
    */    
};