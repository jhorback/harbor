import { html } from 'lit-html';
import { typeStyles } from "./typeStyles";
export default {
    title: 'Foundation/Typography',
    parameters: { options: { showPanel: false } }
};
const TypographyTemplate = () => html `
    <div class="doc-container">
        <h2>Typography</h2>
        <p>
        See:<br>
        <a href="https://m3.material.io/styles/typography" target="md">Material Design Typography</a>
        </p>
        <h3>Examples</h3>
        <hr/>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
        <div class="display-large">Display Large</div>
        <div class="display-medium">Display Medium</div>
        <div class="display-small">Display Small</div>
        <div class="headline-large">Headline Large</div>
        <div class="headline-medium">Headline Medium</div>
        <div class="headline-small">Headline Small</div>
        <div class="title-large">Title Large</div>
        <div class="title-medium">Title Medium</div>
        <div class="title-small">Title Small</div>
        <div class="label-large">Label Large</div>
        <div class="label-medium">Label Medium</div>
        <div class="label-small">Label Small</div>
        <div class="body-large">Body Large</div>
        <div class="body-medium">Body Medium</div>
        <div class="body-small">Body Small</div>
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
    </style>
`;
export const Typography = TypographyTemplate;
