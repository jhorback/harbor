import { html } from 'lit-html';
import "./hb-text-input";
export default {
    title: 'Common/Text Input',
    component: "hb-text-input",
    argTypes: {
        label: {
            control: { type: 'text' },
            description: "An optional field label"
        },
        placeholder: {
            control: { type: 'text' },
            description: "The placeholder text of the text input"
        },
        value: {
            control: { type: 'text' },
            description: "The value of the text input"
        },
        autofocus: {
            control: { type: 'boolean' },
            description: "Adds the autofocus attribute to the text input"
        },
        readonly: {
            control: { type: 'boolean' },
            description: "Makes the input readonly"
        },
        helperText: {
            control: { type: 'text' },
            description: "Small text that shows up under the input"
        },
        errorText: {
            control: { type: 'text' },
            description: "Small error text that shows up under the input"
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-text-input-change"],
        }
    }
};
const TextInputTemplate = ({ label, placeholder, value, autofocus, readonly, errorText, helperText }) => html `
    <hb-text-input
        label=${label}
        ?autofocus=${autofocus}
        ?readonly=${readonly}
        placeholder=${placeholder}
        value=${value}
        error-text=${errorText}
        helper-text=${helperText}
    ></hb-text-input>
`;
// @ts-ignore 
const Template = (args) => TextInputTemplate(args);
export const TextInput = Template.bind({});
TextInput.args = {
    label: "",
    readonly: false,
    autofocus: false,
    placeholder: "Placeholder text",
    value: "",
    errorText: "",
    helperText: "",
};
