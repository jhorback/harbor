import { css } from 'lit-element';
export const formatStyles = css `
table {
    border-collapse: collapse;
}
table td {
    border: 1px solid var(--md-sys-color-outline);
    padding: 8px;
}

figure {
    display: table;
    margin: 1rem auto;
}
figure figcaption {
    color: var(--md-sys-color-on-surface);
    display: block;
    margin-top: 0.25rem;
    text-align: center;
}
hr {
    border: 1px solid var(--md-sys-color-outline);
    border-width: 1px 0 0 0;
}
blockquote {
    background-color: var(--md-sys-color-surface);
    border-left: 5px solid var(--md-sys-color-outline);
    margin: 1.5em 10px;
    padding: 0.5em 10px;
    quotes: "\\201C""\\201D""\\2018""\\2019";
}
blockquote:before {
    color: var(--md-sys-color-outline);
    content: open-quote;
    font-size: 4em;
    line-height: 0.1em;
    margin-right: 0.25em;
    vertical-align: -0.4em;
}
blockquote p {
    display: inline;
}
code, pre {
    background-color: var(--md-sys-color-surface-variant);
    border-radius: var(--md-sys-shape-corner-small); 
    padding: 0.1rem 0.2rem;
}
pre {
    padding: 0.5rem;
}
`;
