import { css } from 'lit-element';
/**
 * Common use page classes
 * // jch: create a storybook page for these/all styles?
 * // May rethink these page-container styles and use size="small|large" attributes!!!
 */
export const pageStyles = css `
.page-container {
    max-width: 750px;
    margin: auto;
    padding: 1rem;
}
.page-container-large {
    max-width: 840px;
    margin: auto;
    padding: 1rem;
}
.page-container-small {
    max-width: 80ch;
    margin: auto;
    padding: 1rem;
}
`;
