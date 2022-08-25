import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { TabBar as HbTabBar } from "./hb-tab-bar";
import "./hb-tab-bar";
import "./hb-link-tab";


export default {
    title: 'Common/Tab Bar',
    component: "hb-tab-bar",
    argTypes: {     
        selected: {
            control: { type: 'select' },
            options: [
                "tab-1",
                "tab-2",
                "tab-3"
            ],
            description: "The id of the selected hb-link-tab"
        }
    },
    parameters: {
        options: { showPanel: true }
    }
} as Meta;


export interface LinkTabProps {
    selected: String;
}


const LinkTabTemplate = ({selected}: LinkTabProps) => html`
    <hb-tab-bar
        selected-tab=${selected}
    >
        <hb-link-tab id="tab-1" label="Tab 1" href="javascript:;" @click=${updateTab("tab-1")}></hb-link-tab>
        <hb-link-tab id="tab-2" label="Tab 2" href="javascript:;" @click=${updateTab("tab-2")}></hb-link-tab>
        <hb-link-tab id="tab-3" label="Tab 3" href="javascript:;" @click=${updateTab("tab-3")}></hb-link-tab>
    </hb-tab-bar>
`;

const updateTab = (id:string) => (e:Event) => {
    const tab = e.target as HTMLElement;
    const tabBar = tab.parentElement as HbTabBar;
    tabBar.selectedTab = tab.id;
};

const Template: Story<Partial<LinkTabProps>> = (args:LinkTabProps) => LinkTabTemplate(args);


export const TabBar = Template.bind({});
TabBar.args = {
   selected: "tab-1"
};