import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { AvatarSize} from "./hb-avatar";



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
                "medium",
                "large"
            ],
            description: "The size of the avatar; small: 32px, medium: 48px, large: 96px"
        }
    }
} as Meta;


export interface AvatarProps {
    href: string;
    size: AvatarSize;
}


const AvatarTemplate = ({href, size}: AvatarProps) => html`
    <hb-avatar
        href=${href}
        size=${size}
    ></hb-avatar>
`;
// @ts-ignore 
const Template: Story<Partial<AvatarProps>> = (args:AvatarProps) => AvatarTemplate(args);


export const Avatar = Template.bind({});
Avatar.args = {
   href: "content/avatars/user1.png",
   size: AvatarSize.small
};