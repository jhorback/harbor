import { Story, Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import "./hb-color-usage";


export default {
    title: 'Foundation/Color'
} as Meta;



const ColorTemplate = () => html`
    <hb-color-usage></hb-color-usage>
`;

// const Template: Story = ColorTemplate;


export const Color = ColorTemplate;


