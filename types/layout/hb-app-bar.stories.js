import { html } from "lit";
import { iconStyles } from "../styles/iconStyles";
import "./hb-app-bar";
import "../domain/mock";
export default {
    title: 'Layout/App Bar',
    component: "hb-app-bar",
    argTypes: {
        showIcons: {
            control: { type: "boolean" },
            defaultValue: true
        }
    },
    parameters: {
        options: { showPanel: true },
        layout: 'fullscreen'
    },
};
const AppBarTemplate = ({ showIcons }) => html `
<hb-app-bar>
    <div slot="buttons" ?hidden=${!showIcons}>
        <span class="icon-button icon-medium">edit_document</span>
        <span class="icon-button icon-medium">add_circle</span>
    </div>
</hb-app-bar>
<style>
${iconStyles}
</style>
`;
// @ts-ignore 
const Template = (args) => AppBarTemplate(args);
export const AppBar = Template.bind({});
AppBar.args = {
    showIcons: true
};
