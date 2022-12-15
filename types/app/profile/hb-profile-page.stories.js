import { html } from 'lit-html';
import "./hb-profile-page";
import { sbRouteHelper } from "../../testUtils/sbRouteHelper";
import "../../domain/mock";
sbRouteHelper({ startPath: "/profile" });
export default {
    title: 'App/Profile Page',
    component: "hb-profile-page",
    argTypes: {},
    parameters: {
        options: { showPanel: false },
        layout: "fullscreen"
    },
};
const ProfilePageTemplate = ({}) => html `
<hb-profile-page></hb-profile-page>
`;
const Template = (args) => ProfilePageTemplate(args);
export const ProfilePage = Template.bind({});
ProfilePage.args = {};
