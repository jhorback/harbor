import { css } from 'lit-element';
export const dialogStyles = css `
dialog {
    z-index:1;
    border: none !important;
    border-radius: var(--md-sys-shape-corner-extra-large);
    background-color: var(--md-sys-color-surface-variant);
    color: var(--md-sys-color-on-background);
    
    box-shadow: 0 0 #0000, 0 0 #0000, 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    
    padding: 24px;
    min-width: 300px;
    max-width: 534px;
}
dialog::backdrop {
    background-color: rgb(0, 0, 0, 0.4)
}
dialog .headline-small {
    margin-bottom: 16px;
}
dialog hr {
    height: 1px;
    border: 0px;
    border-top: 1px solid var(--md-sys-color-outline);
    margin: 16px 0;
}
.dialog-buttons {
    margin-top: 24px;
    display: flex;
    gap: 1rem;
    justify-content: right;
}
`;
