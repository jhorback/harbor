import { css } from 'lit';
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
    /*background-color: var(--md-sys-color-surface);*/
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
    overflow: auto;
}
img {
    max-width: 100%;
}
`;
/**
 * Would need to add prism to get full code syntax highlighting
 * See: https://www.tiny.cloud/docs/tinymce/6/codesample/
 *
 *
 *
.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: var(--md-sys-color-outline);
}
.token.punctuation {
  color: var(--md-sys-color-outline);
}
.namespace {
  opacity: 0.7;
}
.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
  color: var(--md-sys-color-error);
}
.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
  color: #690;
}
.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
  color: #9a6e3a;
}
.token.atrule,
.token.attr-value,
.token.keyword {
  color: var(--md-sys-color-tertiary);
}
.token.function,
.token.class-name {
  color: var(--md-sys-color-secondary);
}
.token.regex,
.token.important,
.token.variable {
  color: #e90;
}
.token.important,
.token.bold {
  font-weight: bold;
}
.token.italic {
  font-style: italic;
}
.token.entity {
  cursor: help;
}
 */ 
