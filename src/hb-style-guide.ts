import { html, css, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { typeStyles } from "./styles/typeStyles";



@customElement('hb-style-guide')
export class StyleGuide extends LitElement {

  render() {
    return html`      
      <slot></slot>

      <div class="swatch-container">
        <div class="swatch body-large primary-swatch">Primary</div>
        <div class="swatch body-large primary-container-swatch">Primary Container</div>
        <div class="swatch body-large secondary-swatch">Secondary</div>
        <div class="swatch body-large secondary-container-swatch">Secondary Container</div>
        <div class="swatch body-large tertiary-swatch">Tertiary</div>
        <div class="swatch body-large tertiary-container-swatch">Tertiary Container</div>
        <div class="swatch body-large error-swatch">Error</div>
        <div class="swatch body-large error-container-swatch">Error Container</div>

        <div class="swatch body-large background-swatch">Background</div>
        <div class="swatch body-large surface-swatch">Surface</div>
        <div class="swatch body-large surface-variant-swatch">Surface Variant</div>
        <div class="swatch body-large inverse-surface-swatch">Inverse Surface</div>

        <div class="swatch body-large outline-swatch">Outline Color</div>
      </div>

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
    `
  }

  static styles = [
    typeStyles,
    css`
    .swatch-container {
        max-width: 750px;
        margin: auto;
        display: flex;
        flex-flow: row wrap;
        justify-content: flex-end;
        align-items: flex-end;
        align-content: flext-start;
        gap: 10px;
    }
    .swatch {
        border: 1px solid var(--md-sys-color-outline);
        height: 100px;
        width: 100px;
        margin: auto;
        border-radius: 5px;
        padding: 1em;
    }

    .primary-swatch {
        background-color: var(--md-sys-color-primary);
        color: var(--md-sys-color-on-primary);
    }
    .primary-container-swatch {
        background-color: var(--md-sys-color-primary-container);
        color: var(--md-sys-color-on-primary-container);
    }
    .secondary-swatch {
        background-color: var(--md-sys-color-secondary);
        color: var(--md-sys-color-on-secondary);
    }
    .secondary-container-swatch {
        background-color: var(--md-sys-color-secondary-container);
        color: var(--md-sys-color-on-secondary-container);
    }
    .tertiary-swatch {
        background-color: var(--md-sys-color-tertiary);
        color: var(--md-sys-color-on-tertiary);
    }
    .tertiary-container-swatch {
        background-color: var(--md-sys-color-tertiary-container);
        color: var(--md-sys-color-on-tertiary-container);
    }
    .error-swatch {
        background-color: var(--md-sys-color-error);
        color: var(--md-sys-color-on-error);
    }
    .error-container-swatch {
        background-color: var(--md-sys-color-error-container);
        color: var(--md-sys-color-on-error-container);
    }
    .background-swatch {
        background-color: var(--md-sys-color-background);
        color: var(--md-sys-color-on-background);
    }
    .surface-swatch {
        background-color: var(--md-sys-color-surface);
        color: var(--md-sys-color-on-surface);
    }
    .surface-variant-swatch {
        background-color: var(--md-sys-color-surface-variant);
        color: var(--md-sys-color-on-surface-variant);
    }
    .inverse-surface-swatch {
        background-color: var(--md-sys-color-inverse-surface);
        color: var(--md-sys-color-inverse-on-surface);
    }
    .outline-swatch {
        background-color: var(--md-sys-color-outline);
        color: var(--md-sys-color-background);
    }

  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-style-guide': StyleGuide
  }
}
