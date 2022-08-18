import { html, css, LitElement } from "lit";
import { customElement } from "lit/decorators.js";
import { typeStyles } from "../../styles/typeStyles";
import { colorStyles } from "../../styles/colorStyles";


/**
 */
@customElement('hb-color-usage')
export class ColorUsage extends LitElement {

  render() {
    return html`      
      <h2>Color Usage</h2>
      <div class="swatch-container">
        <div class="swatch body-large primary on-primary-text">.primary</div>
        <div class="swatch body-large on-primary primary-text">.on-primary</div>
        <div class="swatch body-large primary-container on-primary-container-text">.primary-container</div>
        <div class="swatch body-large on-primary-container primary-container-text">.on-primary-container</div>

        <div class="swatch body-large secondary on-secondary-text">.secondary</div>
        <div class="swatch body-large on-secondary secondary-text">.on-secondary</div>
        <div class="swatch body-large secondary-container on-secondary-container-text">.secondary-container</div>
        <div class="swatch body-large on-secondary-container secondary-container-text">.on-secondary-container</div>
        
        <div class="swatch body-large tertiary on-tertiary-text">.tertiary</div>
        <div class="swatch body-large on-tertiary tertiary-text">.on-tertiary</div>
        <div class="swatch body-large tertiary-container on-tertiary-container-text">.tertiary-container</div>
        <div class="swatch body-large on-tertiary-container tertiary-container-text">.on-tertiary-container</div>
        
        <div class="swatch body-large error on-error-text">.error</div>
        <div class="swatch body-large on-error error-text">.on-error</div>
        <div class="swatch body-large error-container on-error-container-text">.error-container</div>
        <div class="swatch body-large on-error-container error-container-text">.on-error-container</div>
        
        <div class="swatch body-large background on-background-text">.background</div>
        <div class="swatch body-large on-background background-text">.on-background</div>
        <div class="swatch body-large surface on-surface-text">.surface</div>
        <div class="swatch body-large on-surface surface-text">.on-surface</div>

        <div class="swatch body-large outline on-background-text">.outline</div>
        <div class="swatch body-large shadow outline-text">.shadow</div>
        <div class="swatch body-large surface-variant on-surface-variant-text">.surface-variant</div>
        <div class="swatch body-large on-surface-variant surface-variant-text">.on-surface-variant</div>

        <div class="swatch body-large inverse-surface outline-text">.inverse-surface</div>
        <div class="swatch body-large inverse-on-surface outline-text">.inverse-on-surface</div>
        <div class="swatch body-large inverse-primary outline-text">.inverse-primary</div>
        <div class="swatch"></div>

        <div class="swatch body-large surface-tint outline-text">.surface-tint</div>
        <div class="swatch body-large surface-tint-color outline-text">.surface-tint-color</div>
        <div class="swatch"></div>
        <div class="swatch"></div>
      </div>
    `;
  }

  /*
   .surface-tint {
  .surface-tint-text {
  
  .surface-tint-color {
  .surface-tint-color-text {

  .inverse-primary-text {*/

  static styles = [typeStyles, colorStyles, css`
    :host {
      display: block;
      padding: 2rem;
    }
    .swatch-container {
      max-width: 600px;
      margin: 1rem auto;
      display: flex;
      flex-flow: row wrap;
      align-items: flex-end;
      align-content: flex-start;
      gap: 10px;
    }
    .swatch {
      height: 100px;
      width: 100px;
      border-radius: var(--md-sys-shape-corner-medium);
      padding: 1rem;
    }
  `]
}

declare global {
  interface HTMLElementTagNameMap {
    'hb-color-usage': ColorUsage
  }
}
