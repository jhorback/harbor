import { css } from 'lit';
/**
 * Base form styles that do not
 * need first class components
 */
export const formStyles = css `
select {
    display: inline-block;
    min-width: 112px;
    max-width: 280px;
    height: 48px;
    outline: none;
    border: 1px solid var(--md-sys-color-outline);
    border-radius: var(--md-sys-shape-corner-small);
    padding: 0 12px;
    background-color: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-surface-variant);
}
`;
