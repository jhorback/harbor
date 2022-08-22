import { Story, Meta } from '@storybook/web-components';
import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { iconStyles } from "../styles/iconStyles";
import "./hb-app-bar";


export default {
    title: 'Layout/App Bar',
    component: "hb-app-bar",
    argTypes: {
        showIcons: {
            control: { type: "boolean" },
            defaultValue: true
        }
    },
    parameters: {
        options: { showPanel: true },
        layout: 'fullscreen'
    },
} as Meta;




export interface AppBarProps {
    showIcons: Boolean
}

@customElement("hb-app-bar-demo")
class AppBarDemo extends LitElement {

    @property({type: Boolean})
    showIcons = true;

    render() {
        return html`
            <hb-app-bar>
                <div slot="buttons" ?hidden=${!this.showIcons}>
                    <span class="icon-button icon-medium">edit_document</span>
                    <span class="icon-button icon-medium">add_circle</span>
                </div>
            </hb-app-bar>
        `;
    }

    static styles = [iconStyles, css`
        [hidden] {
            display: none;
        }
    `];
}


const AppBarTemplate = ({showIcons}: AppBarProps) => html`
    <hb-app-bar-demo ?showIcons=${showIcons}></hb-app-bar-demo>
`;

const Template: Story<Partial<AppBarProps>> = (args:AppBarProps) => AppBarTemplate(args);


export const AppBar = Template.bind({});
AppBar.args = {
    showIcons: true
};