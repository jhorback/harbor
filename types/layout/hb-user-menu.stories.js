import { html } from "lit";
import "./hb-user-menu";
import "../domain/mock";
export default {
    title: 'Layout/User Menu',
    component: "hb-user-menu",
    argTypes: {
        'sign-out': {
            description: "Event fired when clicking the sign out button",
            table: {
                type: { summary: 'event' },
            }
        },
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["sign-out"],
        }
    },
};
const UserMenuTemplate = ({ state, open }) => html `
<div style="height: 500px;opacity:0;">SPACER</div>
<hb-user-menu ?open=${open}></hb-user-menu>
`;
// @ts-ignore 
const Template = (args) => UserMenuTemplate(args);
export const UserMenu = Template.bind({});
UserMenu.args = {
    open: true
};
