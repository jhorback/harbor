import { html } from 'lit-html';
import "./hb-switch";
export default {
    title: 'Common/Switch',
    component: "hb-switch",
    argTypes: {},
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-switch-change"],
        }
    }
};
const SwitchTemplate = ({ selected, disabled }) => html `
    <hb-switch
        ?selected=${selected}
        ?disabled=${disabled}
    ></hb-text-input>
`;
// @ts-ignore 
const Template = (args) => SwitchTemplate(args);
export const Switch = Template.bind({});
Switch.args = {
    selected: false,
    disabled: false
};
