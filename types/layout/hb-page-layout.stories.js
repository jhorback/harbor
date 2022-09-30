import { html } from 'lit-html';
import "./hb-page-layout";
import { iconStyles } from "../styles/iconStyles";
import { typeStyles } from "../styles/typeStyles";
import "../domain/mock";
export default {
    title: 'Layout/Page Layout',
    component: "hb-page-layout",
    argTypes: {},
    parameters: {
        options: { showPanel: false },
        layout: "fullscreen"
    },
};
const PageLayoutTemplate = ({ small, large }) => html `
<hb-page-layout ?small=${small} ?large=${large}>
  <div slot="app-bar-buttons">
    <span class="icon-button icon-medium" @click=${onClick("Edit Document")}>edit_document</span>
    <span class="icon-button icon-medium" @click=${onClick("Add Document")}>add_circle</span>
  </div>
  <div class="content-container">
  <div class="content">
    <h1>Page Title</h1>
    <p>
      This is the page content here.
    </p>
  </div>
  </div>
</hb-page-layout>
<style>
.content-container {
  max-width:800px;
  margin: auto;
}
.content {
  padding: 0 2rem;
}
${iconStyles}
${typeStyles}
</style>
`;
const onClick = (btnName) => () => alert("Clicked " + btnName);
// @ts-ignore 
const Template = (args) => PageLayoutTemplate(args);
export const PageLayout = Template.bind({});
PageLayout.args = {
    small: false,
    large: false
};
