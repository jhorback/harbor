import { html } from 'lit-html';
import { typeStyles } from "./typeStyles";
import { colorStyles } from "./colorStyles";
import { iconStyles } from "./iconStyles";
export default {
    title: 'Foundation/Icons',
    parameters: { options: { showPanel: false } }
};
const IconTemplate = () => html `
    <div class="doc-container">
        <h2>Icons</h2>
        <p>
        See:<br>
        <a href="https://fonts.google.com/icons" target="mdf">Material Symbols (Google Fonts)</a><br>
        <a href="https://m3.material.io/styles/icons/overview" target="md">Material Design Icons</a>
        </p>
        <h3>Examples</h3>
        <div class="examples">
            <span class="title-large">Settings</span>
            <span class="icon-button icon-small" tabindex="0">settings</span>
            <span class="icon-button icon-medium" tabindex="0">settings</span>
            <span class="icon-button icon-large" tabindex="0">settings</span>
            <span class="icon-button icon-extra-large" tabindex="0">settings</span>
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
    <style>
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
        ${typeStyles}
        ${colorStyles}
        ${iconStyles}
    </style>
`;
export const Icons = IconTemplate;
