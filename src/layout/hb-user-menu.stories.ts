import { Story, Meta } from '@storybook/web-components';
import { html } from "lit";
import { UserMenuData } from "./hb-user-menu";
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
} as Meta;



export interface UserMenuProps {
    state: UserMenuData,
    open: Boolean;
}



const UserMenuTemplate = ({state, open}: UserMenuProps) => html`
<div style="height: 500px;opacity:0;">SPACER</div>
<hb-user-menu ?open=${open}></hb-user-menu>
`;

// @ts-ignore 
const Template: Story<Partial<UserMenuProps>> = (args:UserMenuProps) => UserMenuTemplate(args);


export const UserMenu = Template.bind({});
UserMenu.args = {
    open: true
};