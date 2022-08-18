import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { AvatarType } from "../../hb-avatar";
// import CustomMDXDocumentation from './hb-avatar.mdx';


export default {
    title: 'Layout/Avatar Button',
    component: "hb-avatar",
    // More on argTypes: https://storybook.js.org/docs/web-components/api/argtypes
    argTypes: {     
        onClick: { action: 'onClick' },
        /*
         * See if this shows up as documentation.
         */
        type: {
            control: { type: 'select' },
            options: ['icon-button', 'user-profile'],
            description: "Hello there",
            defaultValue: 'Hello',
            table: {
                type: { summary: 'Hello there' },
                defaultValue: { summary: 'Hellos', },
            }
        },
        /*
         * How about this?
         */
        href: {
            control: { type: 'select' },
            options: ["avatars/user1.png", "avatars/user2.jpg"],
            description: "The url",
            defaultValue: "hell there"
        }
    },
    parameters: {
        docs: {
          page: null,
        },
      },
} as Meta;

export interface AvatarProps {
    type: AvatarType,
    href: string;
    /**
     * Optional click handler
     */
    onClick?: () => void;
}


const AvatarTemplate = ({type, href, onClick}: AvatarProps) => html`
    <hb-avatar
        type="${type}"
        href="${href}"
        @click="${onClick}"
    ></hb-avatar>
`;

const Template: Story<Partial<AvatarProps>> = (args:AvatarProps) => AvatarTemplate(args);


export const AvatarButton = Template.bind({});
// More on args: https://storybook.js.org/docs/web-components/writing-stories/args
AvatarButton.args = {
   type: AvatarType.ICON_BUTTON,
   href: "avatars/user1.png"
};