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
};
const ListItemTemplate = ({ text: name, icon, description, selected }) => html `
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
const Template = (args) => ListItemTemplate(args);
export const ListItem = Template.bind({});
ListItem.args = {
    text: "Primary text",
    icon: "article",
    description: "This is the secondary text",
    selected: false
};
