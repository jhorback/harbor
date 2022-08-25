import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-page-layout";
import { iconStyles } from "../styles/iconStyles";
import { typeStyles } from "../styles/typeStyles";


export default {
    title: 'Layout/Page Layout',
    component: "hb-page-layout",
    argTypes: {     
    },
    parameters: {
        options: { showPanel: false },
        layout: "fullscreen"
    },
} as Meta;

export interface PageLayoutProps {

}


const PageLayoutTemplate = ({}: PageLayoutProps) => html`
<hb-page-layout>
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

const onClick = (btnName:string) => () => alert("Clicked " + btnName);


const Template: Story<Partial<PageLayoutProps>> = (args:PageLayoutProps) => PageLayoutTemplate(args);


export const PageLayout = Template.bind({});
PageLayout.args = {
};