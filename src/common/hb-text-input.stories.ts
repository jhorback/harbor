import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-text-input";



export default {
    title: 'Common/Text Input',
    component: "hb-text-input",
    argTypes: { 
        placeholder: {
            control: { type: 'text' },
            description: "The placeholder text of the text input"
        },
        value: {
            control: { type: 'text' },
            description: "The value of the text input"
        },
        errorText: {
            control: { type: 'text' },
            description: "Error text"
        },
        autofocus: {
            control: { type: 'boolean' },
            description: "Adds the autofocus attribute to the text input"
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-text-input-change"],
        }
    }
} as Meta;


export interface TextInputProps {
    placeholder: string;
    value: string;
    autofocus: boolean;
    errorText: string;
}


const TextInputTemplate = ({placeholder, value, autofocus, errorText}: TextInputProps) => html`
    <hb-text-input
        ?autofocus=${autofocus}
        placeholder=${placeholder}
        value=${value}
        error-text=${errorText}
    ></hb-text-input>
`;

// @ts-ignore 
const Template: Story<Partial<TextInputProps>> = (args:TextInputProps) => TextInputTemplate(args);


export const TextInput = Template.bind({});
TextInput.args = {
   autofocus: false,
   placeholder: "Placeholder text",
   value: "",
   errorText: ""
};