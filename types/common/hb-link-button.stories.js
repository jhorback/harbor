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
            control: { type: "boolean" },
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
};
const LinkButtonTemplate = ({ label, disabled, href, target }) => html `
    <hb-link-button
        ?disabled=${disabled}
        label=${label}
        href=${href}
        target=${target}
    ></hb-link-button>
`;
// @ts-ignore 
const Template = (args) => LinkButtonTemplate(args);
export const LinkButton = Template.bind({});
LinkButton.args = {
    label: "Button Text",
    href: "https://www.google.com",
    disabled: false,
    target: ""
};
