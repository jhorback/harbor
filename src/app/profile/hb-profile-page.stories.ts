import { start } from '@storybook/core-client';
import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-profile-page";
import { sbRouteHelper } from "../../testUtils/sbRouteHelper";



sbRouteHelper({startPath: "/profile"});


export default {
    title: 'App/Profile Page',
    component: "hb-profile-page",
    argTypes: {     
    },
    parameters: {
        options: { showPanel: false },
        layout: "fullscreen"
    },
} as Meta;

export interface ProfilePageProps {

}


const ProfilePageTemplate = ({}: ProfilePageProps) => html`
<hb-profile-page></hb-profile-page>
`;


const Template: Story<Partial<ProfilePageProps>> = (args:ProfilePageProps) => ProfilePageTemplate(args);


export const ProfilePage = Template.bind({});
ProfilePage.args = {
};




