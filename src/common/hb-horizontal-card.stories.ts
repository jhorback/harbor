import { Story, Meta } from '@storybook/web-components';
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
        },
        mediaHref: {
            control: { type: 'text' },
            description: "The URL of the link"
        },
        linkTarget:  {
            control: { type: 'text' },
            description: "The target window of the mediaHref"
        },
        selected: {
            control: { type: 'boolean' },
            description: "If true, makes the card look selected"
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-horizontal-card-click"],
        }
    }
} as Meta;


export interface HorizontalCardProps {
    text: string;
    mediaUrl: string;
    description: string;
    mediaHref: string;
    linkTarget: string;
    selected: boolean;
}


const HorizontalCardTemplate = ({text: name, mediaUrl, description, mediaHref, linkTarget, selected}: HorizontalCardProps) => html`
    <hb-horizontal-card        
        text=${name}
        description=${description}
        media-url=${mediaUrl}
        media-href=${mediaHref}
        link-target=${linkTarget}
        ?selected=${selected}
    ></hb-horizontal-card>
    <style>
        hb-horizontal-card {
            display: inline-block;
            width: 300px;
        }
    </style>
`;

// @ts-ignore 
const Template: Story<Partial<HorizontalCardProps>> = (args:HorizontalCardProps) => HorizontalCardTemplate(args);


export const HorizontalCard = Template.bind({});
HorizontalCard.args = {
   text: "Primary text",
   mediaUrl: "/content/thumbs/default-doc-thumb.png",
   description: "This is the secondary text",
   mediaHref: "",
   linkTarget: "",
   selected: false
};