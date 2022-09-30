import { html } from 'lit-html';
import "./hb-horizontal-card";
export default {
    title: 'Common/Horizontal Card',
    component: "hb-horizontal-card",
    argTypes: {
        text: {
            control: { type: 'text' },
            description: "The primary text of the list item"
        },
        mediaUrl: {
            control: { type: 'text' },
            description: "The URL of the thumbnail image"
        },
        description: {
            control: { type: 'text' },
            description: "The secondary text of the list item"
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-horizontal-card-click"],
        }
    }
};
const HorizontalCardTemplate = ({ text: name, mediaUrl, description }) => html `
    <hb-horizontal-card        
        text=${name}
        description=${description}
        media-url=${mediaUrl}
    ></hb-horizontal-card>
    <style>
        hb-horizontal-card {
            display: inline-block;
            width: 300px;
        }
    </style>
`;
// @ts-ignore 
const Template = (args) => HorizontalCardTemplate(args);
export const HorizontalCard = Template.bind({});
HorizontalCard.args = {
    text: "Primary text",
    mediaUrl: "/content/thumbs/default-doc-thumb.png",
    description: "This is the secondary text"
};
