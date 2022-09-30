import { html } from 'lit-html';
import { AvatarSize } from "./hb-avatar";
export default {
    title: 'Common/Avatar',
    component: "hb-avatar",
    argTypes: {
        href: {
            control: { type: 'select' },
            options: [
                "content/avatars/user1.png",
                "content/avatars/user2.jpg",
                "content/avatars/user3.jpg",
                "bad/url.png"
            ],
            description: "The url"
        },
        size: {
            control: { type: "select" },
            options: [
                "small",
                "large"
            ],
            description: "The size of the avatar; small: 32px, large: 96px"
        }
    }
};
const AvatarTemplate = ({ href, size }) => html `
    <hb-avatar
        href=${href}
        size=${size}
    ></hb-avatar>
`;
// @ts-ignore 
const Template = (args) => AvatarTemplate(args);
export const Avatar = Template.bind({});
Avatar.args = {
    href: "content/avatars/user1.png",
    size: AvatarSize.small
};
