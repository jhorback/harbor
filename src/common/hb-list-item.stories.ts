import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-list-item";



export default {
    title: 'Common/List Item',
    component: "hb-list-item",
    argTypes: {     
        text: {
            control: { type: 'text' },
            description: "The primary text of the list item"
        },
        icon: {
            control: { type: 'text' },
            description: "The Material Design icon name"
        },
        description: {
            control: { type: 'text' },
            description: "The secondary text of the list item"
        },
        selected: {
            control: { type: 'boolean' },
            description: "Set to true if selected",
            defaultValue: false,
            table: {
                defaultValue: { summary: "false" },
                type: { summary: "Set to true if selected" }
            }
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-list-item-click"],
        }
    }
} as Meta;


export interface ListItemProps {
    text: string;
    icon: string;
    description: string;
    selected: boolean;
}


const ListItemTemplate = ({text: name, icon, description, selected}: ListItemProps) => html`
    <hb-list-item
        ?selected=${selected}
        text=${name}
        description=${description}
        icon=${icon}
    ></hb-list-item>
    <style>
        hb-list-item {
            display: inline-block;
            width: 300px;
        }
    </style>
`;

// @ts-ignore 
const Template: Story<Partial<ListItemProps>> = (args:ListItemProps) => ListItemTemplate(args);


export const ListItem = Template.bind({});
ListItem.args = {
   text: "Primary text",
   icon: "article",
   description: "This is the secondary text",
   selected: false
};