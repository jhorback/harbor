import { html } from 'lit-html';
import "./hb-avatar-button";
export default {
    title: 'Layout/Avatar Button',
    component: "hb-avatar-button",
    // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
    argTypes: {
        'hb-avatar-button-click': {
            description: "Event fired when clicking the button",
            //type: { name: 'string', required: false },
            defaultValue: 'Hello',
            table: {
                type: { summary: 'event' },
                // defaultValue: { summary: 'Hello' },
            }
        },
        href: {
            control: { type: 'select' },
            options: [
                "content/avatars/user1.png",
                "content/avatars/user2.jpg",
                "content/avatars/user3.jpg",
                "bad/url.png"
            ],
            description: "The url"
        }
    },
    parameters: {
        options: { showPanel: true },
        actions: {
            handles: ["hb-avatar-button-click"],
        }
    },
};
const AvatarTemplate = ({ href, onClick }) => html `
    <hb-avatar-button
        href="${href}"
        @click="${onClick}"
    ></hb-avatar-button>
`;
// @ts-ignore 
const Template = (args) => AvatarTemplate(args);
export const AvatarButton = Template.bind({});
AvatarButton.args = {
    href: "content/avatars/user1.png"
};
