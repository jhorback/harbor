import { html } from 'lit-html';
import "./hb-button";
export default {
    title: 'Common/Button',
    component: "hb-button",
    argTypes: {
        label: {
            control: { type: 'text' },
            description: "The button label"
        },
        disabled: {
            control: { type: "boolean" },
            description: "Disables the button if true",
            defaultValue: false,
            table: {
                defaultValue: { summary: "false" },
            }
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-button-click"],
        }
    }
};
const ButtonTemplate = ({ label, disabled, selected, tonal, textButton }) => html `
    <hb-button
        ?text-button=${textButton}
        ?disabled=${disabled}
        ?selected=${selected}
        ?tonal=${tonal}
        label=${label}
    ></hb-avatar>
`;
// @ts-ignore 
const Template = (args) => ButtonTemplate(args);
export const Button = Template.bind({});
Button.args = {
    label: "Button Text",
    disabled: false,
    selected: false,
    tonal: false,
    textButton: false
};
