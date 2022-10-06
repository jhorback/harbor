import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-switch";



export default {
    title: 'Common/Switch',
    component: "hb-switch",
    argTypes: { 

    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-switch-change"],
        }
    }
} as Meta;


export interface SwitchProps {
    selected:boolean;
    disabled:boolean;
}


const SwitchTemplate = ({selected, disabled}: SwitchProps) => html`
    <hb-switch
        ?selected=${selected}
        ?disabled=${disabled}
    ></hb-text-input>
`;

// @ts-ignore 
const Template: Story<Partial<SwitchProps>> = (args:SwitchProps) => SwitchTemplate(args);


export const Switch = Template.bind({});
Switch.args = {
   selected: false,
   disabled: false
};