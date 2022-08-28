import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-link-tab";



export default {
    title: 'Common/Link Tab',
    component: "hb-link-tab",
    argTypes: {     
        label: {
            control: { type: 'text' },
            description: "The button label"
        },
        href: {
            control: { type: 'text' },
            description: "The url for the link"
        },
        selected: {
            control: { type: "boolean"},
            description: "Selects the button if true",
            defaultValue: false,
            table: {
                defaultValue: { summary: "false" }
            }
        }
    },
    parameters: {
        options: { showPanel: true }
    }
} as Meta;


export interface LinkTabProps {
    href: string;
    label: string;
    selected: boolean;
}


const LinkTabTemplate = ({label, selected, href}: LinkTabProps) => html`
    <hb-link-tab
        ?selected=${selected}
        label=${label}
        href=${href}
    ></hb-link-tab>
`;

// @ts-ignore 
const Template: Story<Partial<LinkTabProps>> = (args:LinkTabProps) => LinkTabTemplate(args);


export const LinkTab = Template.bind({});
LinkTab.args = {
   label: "Tab text",
   href: "javascript:;",
   selected: false
};