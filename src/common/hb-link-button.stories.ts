import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-link-button";



export default {
    title: 'Common/Link Button',
    component: "hb-link-button",
    argTypes: {     
        label: {
            control: { type: 'text' },
            description: "The button label"
        },
        href: {
            control: { type: 'text' },
            description: "The url for the link"
        },
        disabled: {
            control: { type: "boolean"},
            description: "Disables the button if true",
            defaultValue: false,
            table: {
                defaultValue: { summary: "false" },
                type: { summary: "Set the href to # or javascript:; to fully disable" }
            }
        }
    },
    parameters: {
        options: { showPanel: true }
    }
} as Meta;


export interface LinkButtonProps {
    href: string;
    label: string;
    disabled: boolean;
}


const LinkButtonTemplate = ({label, disabled, href}: LinkButtonProps) => html`
    <hb-link-button
        ?disabled=${disabled}
        label=${label}
        href=${href}
    ></hb-link-button>
`;

const Template: Story<Partial<LinkButtonProps>> = (args:LinkButtonProps) => LinkButtonTemplate(args);


export const LinkButton = Template.bind({});
LinkButton.args = {
   label: "Button Text",
   href: "https://www.google.com",
   disabled: false
};