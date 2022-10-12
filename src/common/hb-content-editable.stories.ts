import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-content-editable";



export default {
    title: 'Common/Content Editable',
    component: "hb-content-editable",
    argTypes: {     
        value: {
            control: { type: 'text' },
            description: "The text value"
        },
        placeholder: {
            control: { type: "text" },
            description: "Optional placeholder text"
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["change"],
        }
    }
} as Meta;


export interface ContentEditableProps {
    value: string;
    placeholder: string;
}


const ContentEditableTemplate = ({value, placeholder}: ContentEditableProps) => html`
    <hb-content-editable
        value=${value}
        placeholder=${placeholder}
    ></hb-content-editable>
`;
// @ts-ignore 
const Template: Story<Partial<ContentEditableProps>> = (args:ContentEditableProps) => ContentEditableTemplate(args);


export const ContentEditable = Template.bind({});
ContentEditable.args = {
   value: "This is the value",
   placeholder: "Enter some text"
};