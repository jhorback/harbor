import { Story, Meta } from '@storybook/web-components';
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
            control: { type: "boolean"},
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
} as Meta;


export interface ButtonProps {
    label: string;
    disabled: boolean;
}


const ButtonTemplate = ({label, disabled}: ButtonProps) => html`
    <hb-button
        ?disabled=${disabled}
        label=${label}
    ></hb-avatar>
`;

const Template: Story<Partial<ButtonProps>> = (args:ButtonProps) => ButtonTemplate(args);


export const Button = Template.bind({});
Button.args = {
   label: "Button Text",
   disabled: false
};