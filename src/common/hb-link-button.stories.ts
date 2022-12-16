import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { ifDefined } from 'lit-html/directives/if-defined';
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
        },
        textButton: {
            control: { type: "boolean"},
            description: "Makes the button look like text",
            defaultValue: false
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
    target?: string;
    textButton: boolean;
}


const LinkButtonTemplate = ({label, disabled, href, target, textButton}: LinkButtonProps) => html`
    <hb-link-button
        ?disabled=${disabled}
        label=${label}
        href=${href}
        text-button=${textButton}
        target=${ifDefined(target)}
    ></hb-link-button>
`;

// @ts-ignore 
const Template: Story<Partial<LinkButtonProps>> = (args:LinkButtonProps) => LinkButtonTemplate(args);


export const LinkButton = Template.bind({});
LinkButton.args = {
   label: "Button Text",
   href: "https://www.google.com",
   disabled: false,
   target: "",
   textButton: false
};