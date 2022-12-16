import { html } from 'lit-html';
import { DEFAULT_IMAGE_URL } from "../pages/contentTypes/image/imageContentType";
import "./hb-card";
const testMediaUrl = "https://firebasestorage.googleapis.com/v0/b/habor-dev.appspot.com/o/files%2F2022-GRPA-4404-2.thumb.jpg?alt=media&token=0f5c4c5c-250d-4a73-87b7-f978389ce19f";
export default {
    title: 'Common/Card',
    component: "hb-card",
    argTypes: {
        text: {
            control: { type: 'text' },
            description: "The primary text of the list item"
        },
        description: {
            control: { type: 'text' },
            description: "The secondary text of the list item"
        },
        mediaUrl: {
            control: { type: 'select' },
            options: [
                "",
                testMediaUrl,
                "content/avatars/user1.png",
                "content/avatars/user2.jpg",
                "content/avatars/user3.jpg",
                DEFAULT_IMAGE_URL
            ],
            description: "The url of the media image"
        },
        mediaHref: {
            control: { type: 'text' },
            description: "The media href"
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-card-click"],
        }
    }
};
const CardTemplate = ({ text: name, mediaUrl, description, mediaHref }) => html `
    <hb-card        
        text=${name}
        description=${description}
        media-url=${mediaUrl}
        media-href=${mediaHref}
    >
        <!-- <div style="margin:0 12px 12px 12px">
            Here is content in a slot
        </div> -->
    </hb-card>
    <style>
        hb-card {
            max-width: 300px;
        }
    </style>
`;
// @ts-ignore 
const Template = (args) => CardTemplate(args);
export const Card = Template.bind({});
Card.args = {
    text: "Primary text",
    description: "This is the secondary text",
    mediaUrl: testMediaUrl,
    mediaHref: "javascript:;"
};
