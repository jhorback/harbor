import { html } from 'lit-html';
import "./hb-about-page";
import "../domain/mock";
export default {
    title: 'App/About Page',
    component: "hb-about-page",
    argTypes: {},
    parameters: {
        options: { showPanel: false },
        layout: "fullscreen"
    },
};
const AboutPageTemplate = ({}) => html `
<hb-about-page></hb-about-page>
`;
// @ts-ignore 
const Template = (args) => AboutPageTemplate(args);
export const AboutPage = Template.bind({});
AboutPage.args = {};
