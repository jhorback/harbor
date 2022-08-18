import { Meta } from '@storybook/web-components';
import { html } from 'lit-html';
import { typeStyles } from "../../styles/typeStyles";
import { colorStyles } from "../../styles/colorStyles";
import { iconStyles } from "../../styles/iconStyles";


export default {
    title: 'Foundation/Shape'
} as Meta;



const ShapeTemplate = () => html`
    <div class="doc-container">
        <h2>Shape</h2>
        <p>
        See:<br>
        <a href="https://m3.material.io/styles/shape/overview" target="md">Material Design Shape</a>
        </p>
        <h3>Examples</h3>
        <div class="shape-container">
            <div class="shape corner-none">corner-none</div>
            <div class="shape corner-extra-small">corner-extra-small</div>
            <div class="shape corner-extra-small-top">corner-extra-small-top</div>
            <div class="shape corner-small">corner-small</div>

            <div class="shape corner-medium">corner-medium</div>
            <div class="shape corner-large">corner-large</div>
            <div class="shape corner-large-end">corner-large-end</div>
            <div class="shape corner-large-top">corner-large-top</div>

            <div class="shape corner-extra-large">corner-extra-large</div>
            <div class="shape corner-extra-large-top">corner-extra-large-top</div>
            <div class="shape corner-full">corner-full</div>

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
        .shape-container {
            max-width: 600px;
            margin: 2rem auto;
            display: flex;
            flex-flow: row wrap;
            align-items: flex-end;
            align-content: flex-start;
            gap: 10px;
        }
        .shape {
            background: var(--md-sys-color-primary-container);
            color: var(--md-sys-color-on-primary-container);
            border: 1px solid var(--md-sys-color-outline);
            width: 100px;
            height: 100px;
            padding: 1rem;
            text-align: center;
        }
        .corner-none { border-radius: var(--md-sys-shape-corner-none); }
        .corner-extra-small { border-radius: var(--md-sys-shape-corner-extra-small); }
        .corner-extra-small-top { border-radius: var(--md-sys-shape-corner-extra-small-top); }
        .corner-small { border-radius: var(--md-sys-shape-corner-small); }
        .corner-medium { border-radius: var(--md-sys-shape-corner-medium); }
        .corner-large { border-radius: var(--md-sys-shape-corner-large); }
        .corner-large-end { border-radius: var(--md-sys-shape-corner-large-end); }
        .corner-large-top { border-radius: var(--md-sys-shape-corner-large-top); }
        .corner-extra-large { border-radius: var(--md-sys-shape-corner-extra-large); }
        .corner-extra-large-top { border-radius: var(--md-sys-shape-corner-extra-large-top); }
        .corner-full { border-radius: var(--md-sys-shape-corner-full); width: 100px;}
        ${typeStyles}
        ${colorStyles}
        ${iconStyles}
    </style>
`;

/*

  --md-sys-shape-corner-extra-large: 28px;
  --md-sys-shape-corner-extra-large-top: 28px 28px 0 0;
  --md-sys-shape-corner-full: 50%;
*/

export const Shape = ShapeTemplate;


