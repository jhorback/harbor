import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-app-bar";


export default {
    title: 'Layout/App Bar',
    component: "hb-app-bar",
    parameters: {
        options: { showPanel: true }
    },
} as Meta;


export interface AppBarProps {

}


const AppBarTemplate = ({}: AppBarProps) => html`
    <hb-app-bar></hb-app-bar>
`;

const Template: Story<Partial<AppBarProps>> = (args:AppBarProps) => AppBarTemplate(args);


export const AppBar = Template.bind({});
AppBar.args = {

};