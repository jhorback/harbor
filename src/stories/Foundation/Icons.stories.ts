import { Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { typeStyles } from "../../styles/typeStyles";
import { colorStyles } from "../../styles/colorStyles";
import { iconStyles } from "../../styles/iconStyles";


export default {
    title: 'Foundation/Icons'
} as Meta;



const IconTemplate = () => html`
    <style>
        ${typeStyles}
        ${colorStyles}
        ${iconStyles}
        h3 {
            margin-top: 3rem;
        }
        .doc-container {
            display: block;
            padding: 2rem;
        }
        .examples {
            padding: 2rem;
        }
        .examples span {
            margin: 1rem;
        }
    </style>
    <div class="doc-container">
        <h2>Icons</h2>
        <p>
        See:<br>
        <a href="https://fonts.google.com/icons" target="mdf">Material Symbols (Google Fonts)</a><br>
        <a href="https://m3.material.io/styles/icons/overview" target="md">Material Design Icon</a>
        </p>
        <h3>Examples</h3>
        <div class="examples">
            <span class="title-large">Settings</span>
            <span class="icon-button icon-small">settings</span>
            <span class="icon-button icon-medium">settings</span>
            <span class="icon-button icon-large">settings</span>
            <span class="icon-button icon-extra-large">settings</span>
        </div>
        <div class="examples">
            <span class="title-large">Menu</span>
            <span class="icon-button icon-small">menu</span>
            <span class="icon-button icon-medium">menu</span>
            <span class="icon-button icon-large">menu</span>
            <span class="icon-button icon-extra-large">menu</span>
        </div>
        <div class="examples">
            <span class="title-large">Search</span>
            <span class="icon-button icon-small">search</span>
            <span class="icon-button icon-medium">search</span>
            <span class="icon-button icon-large">search</span>
            <span class="icon-button icon-extra-large">search</span>
        </div>
        <div class="examples">
            <span class="title-large">Close</span>
            <span class="icon-button icon-small">close</span>
            <span class="icon-button icon-medium">close</span>
            <span class="icon-button icon-large">close</span>
            <span class="icon-button icon-extra-large">close</span>
        </div>
    </div>
`;


export const Icons = IconTemplate;


