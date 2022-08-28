import { start } from '@storybook/core-client';
import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-about-page";


export default {
    title: 'App/About Page',
    component: "hb-about-page",
    argTypes: {     
    },
    parameters: {
        options: { showPanel: false },
        layout: "fullscreen"
    },
} as Meta;

export interface AboutPageProps {

}


const AboutPageTemplate = ({}: AboutPageProps) => html`
<hb-about-page></hb-about-page>
`;

// @ts-ignore 
const Template: Story<Partial<AboutPageProps>> = (args:AboutPageProps) => AboutPageTemplate(args);


export const AboutPage = Template.bind({});
AboutPage.args = {
};




